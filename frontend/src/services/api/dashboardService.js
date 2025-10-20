import api from '../api';
import { toast } from 'react-hot-toast';

const dashboardService = {
  /**
   * Récupère les statistiques du tableau de bord
   * @returns {Promise<Object>} Les statistiques du tableau de bord
   */
  async getDashboardStats() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('[DashboardService] Aucun token trouvé, redirection vers /login');
        // Ne pas rediriger ici, laisser le composant gérer
        throw { isAuthError: true, message: 'Session expirée' };
      }

      console.log('[DashboardService] Récupération des statistiques...');
      const response = await api.get('/api/dashboard/stats');
      
      if (!response.data || !response.data.success) {
        throw new Error('Réponse invalide du serveur');
      }
      
      console.log('[DashboardService] Statistiques récupérées avec succès:', response.data.data);
      
      // Pour le débogage - à supprimer après
      if (response.data.data) {
        console.log('Détails des statistiques:');
        console.log('Total des investissements:', response.data.data.totalInvestments);
        console.log('Gains totaux:', response.data.data.totalEarnings);
        console.log('Utilisateurs actifs:', response.data.data.activeUsers);
        console.log('ROI:', response.data.data.roi);
      }
      
      return response.data.data;
    } catch (error) {
      console.error('[DashboardService] Erreur lors de la récupération des statistiques:', error);
      
      // Si c'est une erreur d'authentification ou de dépôt initial, on la propage telle quelle
      if (error.isAuthError || error.response?.data?.code === 'INITIAL_DEPOSIT_REQUIRED') {
        throw error;
      }
      
      // Pour les autres erreurs, on affiche un message et on propage
      const errorMessage = error.response?.data?.message || 'Erreur lors de la récupération des statistiques';
      
      // Ne pas afficher de toast pour les erreurs de dépôt initial (gérées par l'intercepteur)
      if (error.response?.data?.code !== 'INITIAL_DEPOSIT_REQUIRED') {
        toast.error(errorMessage);
      }
      
      throw error;
    }
  },

  /**
   * Récupère les transactions récentes
   * @param {number} limit - Nombre maximum de transactions à récupérer
   * @returns {Promise<Array>} Liste des transactions récentes
   */
  async getRecentTransactions(limit = 5) {
    try {
      // Vérifier si un token est présent
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return Promise.reject(new Error('Non authentifié'));
      }

      const response = await api.get(`/api/dashboard/transactions/recent?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions récentes:', error);
      
      // Si c'est une erreur d'authentification ou de dépôt initial, on la propage telle quelle
      if (error.response?.status === 401 || error.response?.data?.code === 'INITIAL_DEPOSIT_REQUIRED') {
        throw error;
      }
      
      // Pour les autres erreurs, on affiche un message et on propage
      const errorMessage = error.response?.data?.message || 'Erreur lors de la récupération des transactions récentes';
      
      // Ne pas afficher de toast pour les erreurs de dépôt initial (gérées par l'intercepteur)
      if (error.response?.data?.code !== 'INITIAL_DEPOSIT_REQUIRED') {
        toast.error(errorMessage);
      }
      
      return [];
    }
  },

  /**
   * Récupère les performances des investissements
   * @returns {Promise<Array>} Données de performance des investissements
   */
  async getInvestmentPerformance() {
    try {
      // Vérifier si un token est présent
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return [];
      }

      const response = await api.get('/api/dashboard/investments/performance', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des performances:', error);
      
      if (error.response?.status === 401) {
        window.location.href = '/login';
      } else {
        toast.error('Erreur lors de la récupération des performances des investissements');
      }
      
      return [];
    }
  },

  /**
   * Effectue un dépôt
   * @param {Object} depositData - Données du dépôt
   * @param {number} depositData.amount - Montant du dépôt
   * @param {string} depositData.paymentMethod - Méthode de paiement
   * @param {string} [depositData.currency='EUR'] - Devise du dépôt
   * @param {boolean} [depositData.isInitialDeposit=false] - S'agit-il d'un dépôt initial ?
   * @returns {Promise<Object>} Réponse du serveur
   */
  async createDeposit(depositData) {
    try {
      const response = await api.post('/api/transactions/deposit', depositData);
      
      if (response.data?.success) {
        toast.success(response.data.message || 'Dépôt effectué avec succès');
        return response.data;
      }
      
      throw new Error(response.data?.message || 'Erreur lors du dépôt');
    } catch (error) {
      console.error('Erreur lors du dépôt:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors du traitement du dépôt';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Vérifie le statut d'un dépôt
   * @param {string} transactionId - ID de la transaction
   * @returns {Promise<Object>} Statut du dépôt
   */
  async checkDepositStatus(transactionId) {
    try {
      const response = await api.get(`/api/transactions/${transactionId}/status`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques de dépôt de l'utilisateur
   * @returns {Promise<Object>} Statistiques de dépôt
   */
  async getDepositStats() {
    try {
      const response = await api.get('/api/wallet/address');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de dépôt:', error);
      throw error;
    }
  }
};

export default dashboardService;
