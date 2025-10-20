const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');

console.log('Dashboard routes chargées (authentification requise)');

/**
 * @route   GET /api/dashboard/stats
 * @desc    Récupère les statistiques du tableau de bord
 * @access  Public (temporairement pour le développement)
 */
router.get('/stats', authenticate, async (req, res) => {
  try {
    // Exemple de données - Remplacez par votre logique métier
    const stats = {
      totalInvestments: 12500,
      totalEarnings: 3250,
      activeUsers: 42,
      monthlyGrowth: 12.5,
      recentTransactions: [
        { id: 1, amount: 500, type: 'deposit', status: 'completed', date: new Date() },
        { id: 2, amount: 250, type: 'withdrawal', status: 'pending', date: new Date() },
      ]
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/dashboard/transactions/recent
 * @desc    Récupère les transactions récentes
 * @access  Public (temporairement pour le développement)
 */
router.get('/transactions/recent', /*authenticate,*/ async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    // Exemple de données - Remplacez par votre logique métier
    const transactions = Array.from({ length: limit }, (_, i) => ({
      id: i + 1,
      amount: Math.floor(Math.random() * 1000) + 100,
      type: ['deposit', 'withdrawal', 'investment', 'payout'][Math.floor(Math.random() * 4)],
      status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      description: `Transaction ${i + 1} description`
    }));
    
    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
