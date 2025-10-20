import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getDashboardStats, 
  getEarningsHistory, 
  getPortfolioDistribution, 
  getRecentTransactions,
  getInvestmentPerformance
} from '../services/dashboardService';
import { supabase } from '../utils/supabaseClient';

export function useDashboardData(userId) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: null,
    earningsHistory: [],
    portfolioDistribution: [],
    recentTransactions: [],
    investmentPerformance: []
  });

  const fetchData = useCallback(async () => {
    if (!userId) {
      console.log('[useDashboardData] Aucun userId fourni, annulation du chargement');
      setError('Utilisateur non authentifié');
      setLoading(false);
      return;
    }
    
    try {
      console.log(`[useDashboardData] Chargement des données pour l'utilisateur: ${userId}`);
      setLoading(true);
      setError(null);
      
      // Charger toutes les données en parallèle avec gestion d'erreur individuelle
      const [
        stats, 
        earnings, 
        portfolio, 
        transactions,
        performance
      ] = await Promise.all([
        getDashboardStats(userId).catch(err => {
          console.error('Erreur lors du chargement des statistiques:', err);
          return null;
        }),
        getEarningsHistory(userId).catch(err => {
          console.error('Erreur lors du chargement de l\'historique des gains:', err);
          return [];
        }),
        getPortfolioDistribution(userId).catch(err => {
          console.error('Erreur lors du chargement de la répartition du portefeuille:', err);
          return [];
        }),
        getRecentTransactions(userId).catch(err => {
          console.error('Erreur lors du chargement des transactions récentes:', err);
          return [];
        }),
        getInvestmentPerformance(userId).catch(err => {
          console.error('Erreur lors du chargement des performances:', err);
          return [];
        })
      ]);

      // Vérifier si les statistiques sont disponibles
      if (!stats) {
        throw new Error('Impossible de charger les statistiques du tableau de bord');
      }

      setData({
        stats,
        earningsHistory: earnings || [],
        portfolioDistribution: portfolio || [],
        recentTransactions: transactions || [],
        investmentPerformance: performance || []
      });
      
    } catch (err) {
      console.error('[useDashboardData] Erreur critique:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const subscription = useRef(null);

  useEffect(() => {
    fetchData();
    
    // Configurer l'abonnement aux mises à jour en temps réel
    if (userId) {
      subscription.current = supabase
        .channel('dashboard_updates')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${userId}`
          }, 
          fetchData
        )
        .subscribe();
    }

    return () => {
      if (subscription.current) {
        supabase.removeChannel(subscription.current);
      }
    };
  }, [userId, fetchData]);

  // Fonction pour rafraîchir manuellement les données
  const refreshData = async () => {
    await fetchData();
  };

  return {
    ...data,
    loading,
    error,
    refreshData
  };
}
