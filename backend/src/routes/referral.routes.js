const express = require('express');
const router = express.Router();
const { query, body, param } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const referralController = require('../controllers/referral.controller');

// Middleware d'authentification pour toutes les routes
router.use(authenticate);

// Obtenir les statistiques de parrainage
router.get('/stats', referralController.getReferralStats);

// Obtenir la liste des filleuls
router.get(
  '/list',
  [
    query('status')
      .optional()
      .isIn(['active', 'pending', 'inactive'])
      .withMessage('Invalid status'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be a positive integer')
  ],
  validate,
  referralController.getReferralList
);

// Obtenir l'historique des commissions
router.get(
  '/commissions',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be a positive integer')
  ],
  validate,
  referralController.getCommissionHistory
);

// Générer un lien de parrainage
router.post(
  '/generate-link',
  [
    body('customPath')
      .optional()
      .isString()
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Custom path can only contain letters, numbers, underscores and hyphens')
  ],
  validate,
  referralController.generateReferralLink
);

// Demander un retrait des commissions
router.post(
  '/withdraw',
  [
    body('amount')
      .isFloat({ min: 10 }) // Montant minimum de retrait de 10$
      .withMessage('Minimum withdrawal amount is $10'),
    body('walletAddress')
      .isString()
      .notEmpty()
      .withMessage('Wallet address is required'),
    body('network')
      .optional()
      .isIn(['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'TRC20'])
      .withMessage('Invalid network')
  ],
  validate,
  referralController.withdrawCommissions
);

// Endpoint pour vérifier un code de parrainage (sans authentification requise)
router.get(
  '/verify/:code',
  [
    param('code')
      .isString()
      .notEmpty()
      .withMessage('Referral code is required')
  ],
  validate,
  async (req, res, next) => {
    try {
      const { code } = req.params;

      // Vérifier si le code de parrainage existe
      const { data: referrer, error } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .eq('referral_code', code.toUpperCase())
        .single();

      if (error || !referrer) {
        throw createError(404, 'Invalid referral code');
      }

      res.json({
        success: true,
        data: {
          referrer: {
            id: referrer.id,
            name: `${referrer.first_name} ${referrer.last_name}`.trim()
          },
          code: code.toUpperCase()
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
