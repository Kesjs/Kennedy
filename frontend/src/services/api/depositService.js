import api from './api';

const depositService = {
  /**
   * Crée une nouvelle demande de dépôt
   * @param {Object} depositData - Les données du dépôt
   * @param {number} depositData.amount - Le montant du dépôt
   * @param {string} depositData.paymentMethod - La méthode de paiement
   * @param {string} depositData.currency - La devise (par défaut: 'EUR')
   * @returns {Promise<Object>} - La réponse de l'API
   */
  createDeposit: async (depositData) => {
    try {
      const response = await api.post('/deposits', depositData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du dépôt:', error);
      throw error;
    }
  },

  /**
   * Récupère l'historique des dépôts de l'utilisateur
   * @param {Object} params - Les paramètres de requête
   * @param {number} [params.limit=10] - Nombre maximum de dépôts à récupérer
   * @param {number} [params.offset=0] - Nombre de dépôts à sauter
   * @returns {Promise<Array>} - La liste des dépôts
   */
  getDepositHistory: async ({ limit = 10, offset = 0 } = {}) => {
    try {
      const response = await api.get('/deposits', {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des dépôts:', error);
      throw error;
    }
  },

  /**
   * Annule une demande de dépôt en attente
   * @param {string} depositId - L'ID du dépôt à annuler
   * @returns {Promise<Object>} - La réponse de l'API
   */
  cancelDeposit: async (depositId) => {
    try {
      const response = await api.delete(`/deposits/${depositId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'annulation du dépôt:', error);
      throw error;
    }
  },

  /**
   * Récupère les méthodes de paiement disponibles
   * @returns {Promise<Array>} - La liste des méthodes de paiement
   */
  getPaymentMethods: async () => {
    try {
      // En production, cela pourrait être une requête API
      // Pour l'instant, on retourne une liste statique
      return [
        {
          id: 'bank_transfer',
          name: 'Virement bancaire',
          description: 'Virement SEPA standard (1-3 jours ouvrés)',
          minAmount: 10,
          maxAmount: 10000,
          fees: 0,
          icon: 'bank-transfer',
          available: true
        },
        {
          id: 'credit_card',
          name: 'Carte de crédit',
          description: 'Paiement instantané par carte bancaire',
          minAmount: 10,
          maxAmount: 5000,
          fees: '1.5%',
          icon: 'credit-card',
          available: true
        }
      ];
    } catch (error) {
      console.error('Erreur lors de la récupération des méthodes de paiement:', error);
      throw error;
    }
  }
};

export default depositService;
