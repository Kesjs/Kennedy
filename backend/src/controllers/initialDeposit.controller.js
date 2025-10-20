const { createError } = require('http-errors');
const supabase = require('../config/supabase');

/**
 * Vérifie si l'utilisateur a effectué un dépôt initial
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<boolean>} - True si un dépôt initial a été effectué
 */
const hasInitialDeposit = async (userId) => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('has_initial_deposit')
    .eq('user_id', userId)
    .single();

  if (error || !data) return false;
  return data.has_initial_deposit;
};

/**
 * Vérifie si l'utilisateur a effectué un dépôt initial
 */
exports.checkInitialDepositStatus = async (req, res, next) => {
  try {
    const userId = req.userId;
    const depositDone = await hasInitialDeposit(userId);
    
    res.json({
      success: true,
      data: {
        hasInitialDeposit: depositDone
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Traite un dépôt initial
 */
exports.processInitialDeposit = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { amount, paymentMethod } = req.body;

    // Valider le montant minimum
    const MIN_DEPOSIT = 50; // Montant minimum en euros
    if (amount < MIN_DEPOSIT) {
      throw createError(400, `Le dépôt minimum est de ${MIN_DEPOSIT}€`);
    }

    // Vérifier si un dépôt initial a déjà été effectué
    const depositDone = await hasInitialDeposit(userId);
    if (depositDone) {
      throw createError(400, 'Un dépôt initial a déjà été effectué');
    }

    // Démarrer une transaction
    const { data, error } = await supabase.rpc('process_initial_deposit', {
      p_user_id: userId,
      p_amount: amount,
      p_payment_method: paymentMethod || 'bank_transfer'
    });

    if (error) throw error;
    if (!data || !data.success) {
      throw createError(500, data.message || 'Erreur lors du traitement du dépôt');
    }

    // Mettre à jour le statut de l'utilisateur
    const { error: updateError } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        has_initial_deposit: true,
        updated_at: new Date().toISOString()
      });

    if (updateError) throw updateError;

    // Envoyer une notification ou un email de confirmation
    // À implémenter selon les besoins

    res.json({
      success: true,
      message: 'Dépôt initial effectué avec succès',
      data: {
        transactionId: data.transaction_id,
        amount: amount,
        newBalance: data.new_balance
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware pour vérifier si un dépôt initial est nécessaire
 */
exports.requireInitialDeposit = async (req, res, next) => {
  try {
    const userId = req.userId;
    
    // Si l'utilisateur est un administrateur, on saute la vérification
    if (req.userRole === 'admin') {
      return next();
    }

    const depositDone = await hasInitialDeposit(userId);
    
    if (!depositDone) {
      return res.status(403).json({
        success: false,
        code: 'INITIAL_DEPOSIT_REQUIRED',
        message: 'Un dépôt initial est requis pour accéder à cette fonctionnalité',
        requiredAction: 'initialDeposit'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
