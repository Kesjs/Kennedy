const express = require('express');
const router = express.Router();
const { param, query, body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const transactionController = require('../controllers/transaction.controller');
const { requireInitialDeposit } = require('../middleware/requireInitialDeposit.middleware');

// Middleware d'authentification pour toutes les routes
router.use(authenticate);

// Obtenir l'historique des transactions
router.get(
  '/',
  [
    query('type')
      .optional()
      .isIn(['deposit', 'withdrawal', 'investment', 'profit', 'referral'])
      .withMessage('Invalid transaction type'),
    query('status')
      .optional()
      .isIn(['pending', 'completed', 'failed', 'cancelled'])
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
  transactionController.getTransactionHistory
);

// Obtenir les détails d'une transaction spécifique
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid transaction ID')
  ],
  validate,
  transactionController.getTransactionDetails
);

// Effectuer un dépôt
router.post(
  '/deposit',
  [
    body('amount')
      .isFloat({ min: 1 })
      .withMessage('Le montant doit être un nombre positif'),
    body('currency')
      .optional()
      .isString()
      .isIn(['EUR', 'USD', 'BTC', 'ETH', 'USDT'])
      .withMessage('Devise non prise en charge'),
    body('paymentMethod')
      .isIn(['bank_transfer', 'credit_card', 'crypto'])
      .withMessage('Méthode de paiement non valide'),
    body('isInitialDeposit')
      .optional()
      .isBoolean()
      .withMessage('Le statut de dépôt initial doit être un booléen')
  ],
  validate,
  transactionController.processDeposit
);

// Créer une demande de retrait
router.post(
  '/withdraw',
  [
    body('amount')
      .isFloat({ min: 1 })
      .withMessage('Amount must be greater than 0'),
    body('walletAddress')
      .isString()
      .notEmpty()
      .withMessage('Wallet address is required'),
    body('network')
      .optional()
      .isString()
      .isIn(['BTC', 'ETH', 'USDT', 'USDC', 'BNB'])
      .withMessage('Invalid network')
  ],
  validate,
  transactionController.createWithdrawalRequest
);

// Annuler une demande de retrait
router.post(
  '/:id/cancel',
  [
    param('id').isUUID().withMessage('Invalid transaction ID')
  ],
  validate,
  transactionController.cancelWithdrawalRequest
);

module.exports = router;
