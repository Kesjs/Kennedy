const { createError } = require('http-errors');
const supabase = require('../config/supabase');

/**
 * Middleware pour vérifier si un dépôt initial est requis
 * Redirige vers la page de dépôt initial si nécessaire
 */
const requireInitialDeposit = async (req, res, next) => {
  try {
    // Si l'utilisateur est un administrateur, on saute la vérification
    if (req.userRole === 'admin') {
      return next();
    }

    // Vérifier si un dépôt initial a été effectué
    const { data: userSettings, error } = await supabase
      .from('user_settings')
      .select('has_initial_deposit')
      .eq('user_id', req.userId)
      .single();

    if (error || !userSettings) {
      // Si l'utilisateur n'a pas de paramètres, on considère qu'aucun dépôt n'a été effectué
      return res.status(403).json({
        success: false,
        code: 'INITIAL_DEPOSIT_REQUIRED',
        message: 'Un dépôt initial est requis pour accéder à cette fonctionnalité',
        requiredAction: 'initialDeposit'
      });
    }

    if (!userSettings.has_initial_deposit) {
      return res.status(403).json({
        success: false,
        code: 'INITIAL_DEPOSIT_REQUIRED',
        message: 'Un dépôt initial est requis pour accéder à cette fonctionnalité',
        requiredAction: 'initialDeposit'
      });
    }

    next();
  } catch (error) {
    next(createError(500, 'Erreur lors de la vérification du dépôt initial', { originalError: error }));
  }
};

module.exports = requireInitialDeposit;
