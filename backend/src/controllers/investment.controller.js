const { createError } = require('http-errors');
const supabase = require('../config/supabase');

// Obtenir tous les réservoirs disponibles
exports.getReservoirs = async (req, res, next) => {
  try {
    const { data: reservoirs, error } = await supabase
      .from('reservoirs')
      .select('*')
      .eq('is_active', true)
      .order('min_investment', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: reservoirs
    });
  } catch (error) {
    next(error);
  }
};

// Créer un nouvel investissement
exports.createInvestment = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { reservoirId, amount } = req.body;

    // Vérifier si le réservoir existe et est actif
    const { data: reservoir, error: reservoirError } = await supabase
      .from('reservoirs')
      .select('*')
      .eq('id', reservoirId)
      .eq('is_active', true)
      .single();

    if (reservoirError || !reservoir) {
      throw createError(404, 'Reservoir not found or inactive');
    }

    // Vérifier si le montant est dans la plage autorisée
    if (amount < reservoir.min_investment || 
        (reservoir.max_investment && amount > reservoir.max_investment)) {
      throw createError(400, `Amount must be between $${reservoir.min_investment} and $${reservoir.max_investment || 'unlimited'}`);
    }

    // Vérifier le solde de l'utilisateur (à implémenter avec le service de portefeuille)
    // Pour l'instant, nous supposons que l'utilisateur a suffisamment de fonds

    // Démarrer une transaction
    const { data: investment, error: investmentError } = await supabase.rpc('create_investment', {
      p_user_id: userId,
      p_reservoir_id: reservoirId,
      p_amount: amount,
      p_daily_return: reservoir.daily_return,
      p_contract_days: reservoir.contract_days
    });

    if (investmentError) throw investmentError;

    res.status(201).json({
      success: true,
      message: 'Investment created successfully',
      data: investment
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir les investissements d'un utilisateur
exports.getUserInvestments = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { status } = req.query;

    let query = supabase
      .from('investments')
      .select(`
        id,
        amount,
        start_date,
        end_date,
        status,
        daily_profit,
        total_profit,
        reservoir:reservoir_id (
          id,
          name,
          daily_return,
          contract_days
        )
      `)
      .eq('user_id', userId);

    // Filtrer par statut si fourni
    if (status) {
      query = query.in('status', Array.isArray(status) ? status : [status]);
    }

    const { data: investments, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: investments
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir les détails d'un investissement spécifique
exports.getInvestmentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const { data: investment, error } = await supabase
      .from('investments')
      .select(`
        id,
        amount,
        start_date,
        end_date,
        status,
        daily_profit,
        total_profit,
        created_at,
        updated_at,
        reservoir:reservoir_id (
          id,
          name,
          description,
          daily_return,
          contract_days
        )
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !investment) {
      throw createError(404, 'Investment not found');
    }

    res.json({
      success: true,
      data: investment
    });
  } catch (error) {
    next(error);
  }
};

// Retirer les bénéfices d'un investissement
exports.withdrawProfit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Vérifier si l'investissement existe et appartient à l'utilisateur
    const { data: investment, error: investmentError } = await supabase
      .from('investments')
      .select('id, total_profit, status')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (investmentError || !investment) {
      throw createError(404, 'Investment not found');
    }

    if (investment.status !== 'active') {
      throw createError(400, 'Investment is not active');
    }

    if (investment.total_profit <= 0) {
      throw createError(400, 'No profit available for withdrawal');
    }

    // Démarrer une transaction pour le retrait
    const { data: transaction, error: transactionError } = await supabase.rpc('withdraw_investment_profit', {
      p_investment_id: id,
      p_user_id: userId,
      p_amount: investment.total_profit
    });

    if (transactionError) throw transactionError;

    res.json({
      success: true,
      message: 'Profit withdrawn successfully',
      data: {
        amount: investment.total_profit,
        transactionId: transaction.id
      }
    });
  } catch (error) {
    next(error);
  }
};
