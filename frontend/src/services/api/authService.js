import api from './api';

const authService = {
  /**
   * Récupère le profil de l'utilisateur connecté
   * @returns {Promise<Object>} Les données du profil utilisateur
   */
  async getUserProfile() {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur:', error);
      throw error;
    }
  },

  /**
   * Vérifie si l'utilisateur a effectué un dépôt initial
   * @returns {Promise<boolean>} True si un dépôt initial a été effectué
   */
  async checkInitialDeposit() {
    try {
      const response = await api.get('/api/initial-deposit/status');
      return response.data.data?.hasInitialDeposit || false;
    } catch (error) {
      console.error('Erreur lors de la vérification du dépôt initial:', error);
      // En cas d'erreur, on considère qu'aucun dépôt n'a été effectué
      return false;
    }
  },

  /**
   * Effectue un dépôt initial
   * @param {number} amount - Montant du dépôt
   * @param {string} paymentMethod - Méthode de paiement
   * @returns {Promise<Object>} Les données de la transaction
   */
  async processInitialDeposit(amount, paymentMethod = 'bank_transfer') {
    try {
      const response = await api.post('/api/initial-deposit/process', {
        amount,
        paymentMethod
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du traitement du dépôt initial:', error);
      throw error;
    }
  },

  // Autres méthodes d'authentification existantes...
};

export default authService;
