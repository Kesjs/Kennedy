const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const initialDepositController = require('../controllers/initialDeposit.controller');

// Middleware d'authentification pour toutes les routes
router.use(authenticate);

/**
 * @route   GET /api/initial-deposit/status
 * @desc    Vérifie si un dépôt initial a été effectué
 * @access  Privé
 */
router.get(
  '/status',
  initialDepositController.checkInitialDepositStatus
);

/**
 * @route   POST /api/initial-deposit/process
 * @desc    Traite un dépôt initial
 * @access  Privé
 */
router.post(
  '/process',
  [
    body('amount')
      .isFloat({ min: 50 })
      .withMessage('Le montant minimum est de 50€'),
    body('paymentMethod')
      .optional()
      .isIn(['bank_transfer', 'credit_card', 'crypto'])
      .withMessage('Méthode de paiement non valide')
  ],
  validate,
  initialDepositController.processInitialDeposit
);

module.exports = router;
