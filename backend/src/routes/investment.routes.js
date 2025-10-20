const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const investmentController = require('../controllers/investment.controller');

// Middleware d'authentification pour toutes les routes
router.use(authenticate);

// Obtenir tous les réservoirs disponibles
router.get('/reservoirs', investmentController.getReservoirs);

// Créer un nouvel investissement
router.post(
  '/',
  [
    body('reservoirId').isUUID().withMessage('Invalid reservoir ID'),
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0')
  ],
  validate,
  investmentController.createInvestment
);

// Obtenir les investissements de l'utilisateur
router.get(
  '/',
  [
    query('status')
      .optional()
      .isIn(['active', 'completed', 'cancelled'])
      .withMessage('Invalid status')
  ],
  validate,
  investmentController.getUserInvestments
);

// Obtenir les détails d'un investissement spécifique
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid investment ID')
  ],
  validate,
  investmentController.getInvestmentDetails
);

// Retirer les bénéfices d'un investissement
router.post(
  '/:id/withdraw-profit',
  [
    param('id').isUUID().withMessage('Invalid investment ID')
  ],
  validate,
  investmentController.withdrawProfit
);

module.exports = router;
