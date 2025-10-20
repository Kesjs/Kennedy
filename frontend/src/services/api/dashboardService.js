import api from '../api';
import { toast } from 'react-hot-toast';

const dashboardService = {
  /**
   * Récupère les statistiques du tableau de bord
   * @returns {Promise<Object>} Les statistiques du tableau de bord
   */
  getDashboardStats: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('[DashboardService] Aucun token trouvé, redirection vers /login');
        // Ne pas rediriger ici, laisser le composant gérer
        throw { isAuthError: true, message: 'Session expirée' };
      }

      console.log('[DashboardService] Récupération des statistiques...');
      const response = await api.get('/dashboard/stats');
      
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
      
      // Si c'est une erreur d'authentification, on la propage telle quelle
      if (error.isAuthError) {
        throw error;
      }
      
      // Pour les autres erreurs, on affiche un message et on propage
      const errorMessage = error.response?.data?.message || 'Erreur lors de la récupération des statistiques';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * Récupère les transactions récentes
   * @param {number} limit - Nombre maximum de transactions à récupérer
   * @returns {Promise<Array>} Liste des transactions récentes
   */
  getRecentTransactions: async (limit = 5) => {
    try {
      // Vérifier si un token est présent
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return Promise.reject(new Error('Non authentifié'));
      }

      const response = await api.get(`/dashboard/transactions/recent?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions récentes:', error);
      
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      
      const errorMessage = error.response?.data?.message || 'Erreur lors de la récupération des transactions';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * Récupère les performances des investissements
   * @returns {Promise<Array>} Données de performance des investissements
   */
  getInvestmentPerformance: async () => {
    try {
      // Vérifier si un token est présent
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return [];
      }

      const response = await api.get('/dashboard/investments/performance', {
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
  }
};

export default dashboardService;
