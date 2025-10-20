import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiPieChart, 
  FiUsers,
  FiRefreshCw,
  FiAlertCircle,
  FiArrowUpRight,
  FiArrowDownRight
} from 'react-icons/fi';
import dashboardService from '../../services/dashboardService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatCard from '../../components/dashboard/StatCard';
import TransactionItem from '../../components/transactions/TransactionItem';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [dashboardData, recentTransactions, investmentPerformance] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentTransactions(5),
        dashboardService.getInvestmentPerformance()
      ]);
      
      setStats(dashboardData);
      setTransactions(recentTransactions);
      setPerformanceData(investmentPerformance);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les données du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <FiRefreshCw className="mr-1.5 h-3 w-3" />
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-gray-500">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          disabled={loading}
        >
          <FiRefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Solde total" 
          value={stats?.total_balance || 0} 
          icon={FiDollarSign} 
          color="blue" 
        />
        <StatCard 
          title="Gains totaux" 
          value={stats?.total_earnings || 0} 
          icon={FiTrendingUp} 
          color="green"
          change={stats?.monthly_earnings > 0 ? 
            ((stats.monthly_earnings - (stats.last_month_earnings || 0)) / (stats.last_month_earnings || 1) * 100).toFixed(1) : 0}
        />
        <StatCard 
          title="Investissements actifs" 
          value={stats?.active_investments || 0} 
          icon={FiPieChart} 
          color="purple" 
        />
        <StatCard 
          title="Parrainages" 
          value={stats?.referral_count || 0} 
          icon={FiUsers} 
          color="amber" 
        />
      </div>

      {/* Graphique et transactions récentes */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Graphique */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Performance des investissements</h2>
          {performanceData.length > 0 ? (
            <div className="h-64">
              {/* Intégrer un composant de graphique ici */}
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Graphique des performances</p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucune donnée de performance disponible</p>
            </div>
          )}
        </div>

        {/* Dernières transactions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Dernières transactions</h2>
            <button 
              onClick={() => navigate('/transactions')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Voir tout
            </button>
          </div>
          
          {transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>Aucune transaction récente</p>
            </div>
          )}
        </div>
      </div>

      {/* Section d'actions rapides */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-4">Actions rapides</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/invest')}
              className="w-full flex items-center justify-between px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <span>Faire un investissement</span>
              <FiArrowUpRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/withdraw')}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <span>Faire un retrait</span>
              <FiArrowUpRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/referrals')}
              className="w-full flex items-center justify-between px-4 py-3 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              <span>Parrainer un ami</span>
              <FiUsers className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Section des performances */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-4">Résumé des performances</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Gains ce mois-ci</p>
              <p className="text-xl font-semibold text-gray-900">
                {stats?.monthly_earnings?.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'XOF',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }) || '0 FCFA'}
              </p>
              <p className={`text-sm mt-1 ${
                stats?.monthly_earnings > (stats?.last_month_earnings || 0) 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {stats?.last_month_earnings 
                  ? `${((stats.monthly_earnings - stats.last_month_earnings) / stats.last_month_earnings * 100).toFixed(1)}% par rapport au mois dernier`
                  : 'Nouveau ce mois-ci'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Dépôts totaux</p>
              <p className="text-xl font-semibold text-gray-900">
                {stats?.total_deposits?.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'XOF',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }) || '0 FCFA'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Retraits totaux</p>
              <p className="text-xl font-semibold text-gray-900">
                {stats?.total_withdrawals?.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'XOF',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }) || '0 FCFA'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Dernière mise à jour</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(stats?.last_updated).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;