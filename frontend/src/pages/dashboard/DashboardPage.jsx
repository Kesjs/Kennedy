import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiTrendingUp, FiPieChart, FiUsers, FiRefreshCw, FiAlertCircle, FiArrowUpRight, FiArrowDownRight, FiAlertTriangle, FiPlus, FiMinus, FiArrowRight, FiDownload, FiUpload, FiCreditCard, FiInfo } from 'react-icons/fi';
import dashboardService from '../../services/api/dashboardService';
import { formatCurrency } from '../../utils/format';
import NavigationTest from '../../components/debug/NavigationTest';

// Composant de chargement avec animation
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    <p className="text-sm text-gray-500">Chargement des données...</p>
  </div>
);

// Composant de carte de statistique amélioré avec daisyUI
const StatCard = React.memo(({ title, value, icon: Icon, color = 'primary', change, suffix = '' }) => {
  const colors = {
    primary: 'bg-blue-500 text-blue-600 dark:text-blue-400',
    secondary: 'bg-purple-500 text-purple-600 dark:text-purple-400',
    accent: 'bg-pink-500 text-pink-600 dark:text-pink-400',
    success: 'bg-green-500 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-500 text-yellow-600 dark:text-yellow-400',
    error: 'bg-red-500 text-red-600 dark:text-red-400',
    info: 'bg-cyan-500 text-cyan-600 dark:text-cyan-400',
  };

  // Fonction pour formater la valeur en fonction du type
  const formatValue = (val) => {
    // Si la valeur est nulle ou non définie, retourner 0 formaté selon le type
    if (val === null || val === undefined || val === '') {
      return title === 'Taux de rendement' ? '0.00' : '0';
    }

    // Convertir en nombre
    const numVal = parseFloat(val);
    if (isNaN(numVal)) return '0';
    
    if (title === 'Utilisateurs actifs') {
      // Pour les utilisateurs, on affiche un nombre entier sans décimales
      return Math.round(numVal).toLocaleString('fr-FR');
    } else if (title === 'Taux de rendement') {
      // Pour le taux de rendement, on formate avec 2 décimales et le symbole %
      return numVal.toFixed(2);
    } else if (title === 'Total des investissements' || title === 'Gains totaux' || title === 'Solde disponible') {
      // Pour les montants, on utilise le formatage de devise sans le symbole € (car ajouté via suffix)
      return numVal.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
      });
    }
    
    // Pour les autres cas, retourner la valeur telle quelle
    return numVal;
  };

  return (
    <div className="bg-white dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600/20 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${colors[color]} bg-opacity-10 dark:bg-opacity-30`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
            {formatValue(value)}
            {suffix && <span className="text-base font-normal ml-1 text-gray-500 dark:text-gray-400">{suffix}</span>}
          </p>
        </div>
      </div>
      {change !== undefined && change !== null && (
        <div className="mt-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            change >= 0 
              ? 'bg-green-900/30 text-green-400 border border-green-800/30' 
              : 'bg-red-900/30 text-red-400 border border-red-800/30'
          }`}>
            {change >= 0 ? (
              <FiArrowUpRight className="h-3.5 w-3.5 mr-1.5" />
            ) : (
              <FiArrowDownRight className="h-3.5 w-3.5 mr-1.5" />
            )}
            {Math.abs(change)}%
          </span>
        </div>
      )}
    </div>
  );
});

// Composant de transaction amélioré avec un meilleur contraste et espacement
const TransactionItem = React.memo(({ type, amount, date, status }) => {
  // Définition des couleurs et styles pour chaque statut
  const statusStyles = {
    completed: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-200',
      label: 'Terminé'
    },
    pending: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-200',
      label: 'En attente'
    },
    failed: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-200',
      label: 'Échoué'
    },
    processing: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-200',
      label: 'En traitement'
    }
  };

  const typeIcons = {
    deposit: <FiDownload className="w-5 h-5" />,
    withdrawal: <FiUpload className="w-5 h-5" />,
    transfer: <FiRefreshCw className="w-5 h-5" />,
    investment: <FiTrendingUp className="w-5 h-5" />,
    profit: <FiDollarSign className="w-5 h-5" />,
    payout: <FiCreditCard className="w-5 h-5" />
  };

  const typeLabels = {
    deposit: 'Dépôt',
    withdrawal: 'Retrait',
    profit: 'Gain',
    investment: 'Investissement',
    payout: 'Paiement',
    transfer: 'Transfert'
  };

  const isPositive = ['deposit', 'profit'].includes(type);
  const amountColor = isPositive 
    ? 'text-green-700 dark:text-green-400 font-semibold' 
    : 'text-red-700 dark:text-red-400 font-semibold';
  
  const amountSign = isPositive ? '+' : '-';
  const Icon = isPositive ? FiArrowDownRight : FiArrowUpRight;
  const statusStyle = statusStyles[status] || statusStyles.failed;

  // Formatage de la date
  const formattedDate = date ? (() => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'Date inconnue';
      
      const now = new Date();
      const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return `Aujourd'hui, ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (diffDays === 1) {
        return `Hier, ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (diffDays < 7) {
        return d.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } else {
        return d.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (e) {
      return 'Date inconnue';
    }
  })() : 'Date inconnue';

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-gray-800/50 transition-colors rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${
          type === 'deposit' 
            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        }`}>
          {type === 'deposit' ? 
            <FiDownload className="w-4 h-4" /> : 
            <FiUpload className="w-4 h-4" />
          }
        </div>
        <div>
          <p className="font-medium text-white">
            {type === 'deposit' ? 'Dépôt' : 'Retrait'}
          </p>
          <p className="text-sm text-gray-400">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${
          type === 'deposit' ? 'text-green-400' : 'text-blue-400'
        }`}>
          {type === 'deposit' ? '+' : '-'}{amount} €
        </p>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
          status === 'completed'
            ? 'bg-green-900/30 text-green-400 border border-green-800/30'
            : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/30'
        }`}>
          {status === 'completed' ? 'Complété' : 'En attente'}
        </span>
      </div>
    </div>
  );
});

// État initial vide pour le tableau de bord
const initialStats = {
  balance: 0,
  monthlyGrowth: 0,
  totalInvestments: 0,
  investmentGrowth: 0,
  totalEarnings: 0,
  earningsChange: 0,
  activeUsers: 0,
  userGrowth: 0,
  monthlyEarnings: 0,
  lastMonthEarnings: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  lastUpdated: new Date().toISOString(),
  lastDepositDate: null,
  lastWithdrawalDate: null,
  roi: 0,
  roiChange: 0
};

const DashboardPage = () => {
  // État local
  const [stats, setStats] = useState(initialStats);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();

  // Fonction pour charger les données
  const fetchData = useCallback(async () => {
    try {
      setLoading(!refreshing);
      setError(null);
      
      // Vérifier le token avant de faire les appels
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('[Dashboard] Aucun token trouvé, déconnexion...');
        navigate('/login');
        return;
      }
      
      try {
        // Chargement en parallèle
        const [dashboardData, recentTransactions] = await Promise.all([
          dashboardService.getDashboardStats()
            .catch(err => {
              if (err.isInitialDepositRequired) {
                console.log('[Dashboard] Dépôt initial requis');
                setIsNewUser(true);
                return null;
              }
              console.error('[Dashboard] Erreur lors de la récupération des statistiques:', err);
              throw err;
            }),
          dashboardService.getRecentTransactions(5).catch(() => [])
        ]);

        // Si on a des données valides du serveur
        if (dashboardData && dashboardData.success !== false) {
          setStats({
            ...initialStats,
            ...dashboardData,
            lastUpdated: new Date().toISOString()
          });
          setIsNewUser(false);
        } else {
          // Utiliser les valeurs par défaut pour un nouvel utilisateur
          setStats({
            ...initialStats,
            lastUpdated: new Date().toISOString()
          });
          setIsNewUser(true);
        }
        
        setTransactions(recentTransactions || []);
        
      } catch (err) {
        console.error('[Dashboard] Erreur lors du chargement des données:', err);
        
        // En cas d'erreur d'authentification, rediriger vers la page de connexion
        if (err.isAuthError) {
          console.log('[Dashboard] Erreur d\'authentification, déconnexion...');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        
        // Pour les autres erreurs, on utilise les valeurs par défaut
        console.log('[Dashboard] Utilisation des valeurs par défaut suite à une erreur');
        setStats({
          ...initialStats,
          lastUpdated: new Date().toISOString()
        });
        setTransactions([]);
        setIsNewUser(true);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing, navigate]);

  // Effet pour charger les données au montage
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fonction pour rafraîchir les données
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Gestion des erreurs
  if (error) {
    return (
      <div className="w-full p-6">
        <div className="alert alert-error shadow-lg">
          <div className="flex items-start">
            <FiAlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="font-bold">Erreur de chargement</h3>
              <div className="text-sm mt-1">
                {typeof error === 'string' ? error : error?.message || 'Une erreur inconnue est survenue'}
              </div>
              <button
                onClick={fetchData}
                className="mt-3 btn btn-sm btn-ghost"
              >
                <FiRefreshCw className="mr-2" />
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage principal du tableau de bord
  
  // Afficher un message de bienvenue pour les nouveaux utilisateurs
  if (isNewUser && !loading && !error) {
    return (
      <div className="w-full p-4 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <div className="w-32 h-32 mx-auto md:mx-0 bg-gradient-to-br from-purple-600/20 to-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/10 mb-6">
                  <FiTrendingUp className="w-16 h-16 text-purple-400" />
                </div>
                <button
                  onClick={() => navigate('/invest')}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium text-sm flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors">
                  <FiInfo className="mr-2" /> En savoir plus
                </button>
              </div>
              <div className="md:w-1/2 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Comment commencer ?</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mr-3 mt-0.5">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Effectuez un dépôt</h4>
                      <p className="text-sm text-gray-300">Créez votre premier portefeuille en ajoutant des fonds.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-3 mt-0.5">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Choisissez un investissement</h4>
                      <p className="text-sm text-gray-300">Sélectionnez parmi nos options d'investissement.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mr-3 mt-0.5">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Suivez vos performances</h4>
                      <p className="text-sm text-gray-300">Visualisez la croissance de votre portefeuille.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Comment commencer ?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mr-3 mt-0.5">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Effectuez un dépôt</h4>
                    <p className="text-sm text-gray-300">Créez votre premier portefeuille en ajoutant des fonds.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-3 mt-0.5">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Choisissez un investissement</h4>
                    <p className="text-sm text-gray-300">Sélectionnez parmi nos options d'investissement.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mr-3 mt-0.5">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Suivez vos performances</h4>
                    <p className="text-sm text-gray-300">Visualisez la croissance de votre portefeuille.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si chargement en cours
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 md:p-6 lg:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Composant de test de navigation */}
        <NavigationTest />
        
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Tableau de bord
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Bon retour, <span className="font-medium text-gray-900 dark:text-white">{userData?.firstName || 'Utilisateur'}</span>. Voici un aperçu de vos activités.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/deposit', { state: { from: 'dashboard-header' } })}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all flex items-center hover:shadow-lg hover:shadow-blue-500/20">
              <FiPlus className="mr-1.5" /> Dépôt
            </button>
            <button 
              onClick={() => navigate('/dashboard/withdraw')}
              className="px-4 py-2 bg-gray-800/50 text-gray-200 text-sm font-medium rounded-lg border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 transition-all flex items-center hover:shadow-lg hover:shadow-gray-900/10">
              <FiMinus className="mr-1.5" /> Retrait
            </button>
          </div>
        </div>

        {/* Carte de bienvenue et solde */}
        <div className="bg-white dark:bg-gray-700/50 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600/30 overflow-hidden backdrop-blur-sm">
          <div className="p-6 md:p-8">
            {isNewUser && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-900">
                <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Bienvenue sur votre tableau de bord !</h2>
                <p className="text-blue-700 dark:text-blue-300">
                  Commencez votre parcours d'investissement en effectuant votre premier dépôt. Une fois votre compte approvisionné, vous pourrez commencer à investir et voir vos performances ici.
                </p>
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* Partie gauche : Texte et montant */}
              <div className="space-y-4 flex-1 w-full">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-600/30 text-gray-700 dark:text-gray-200 text-sm font-medium">
                  <FiDollarSign className="w-4 h-4 mr-1.5" />
                  <span>Solde disponible</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats?.balance || 0, 'EUR')}
                  </p>
                  
                  {stats?.monthlyGrowth !== undefined && (
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        stats.monthlyGrowth >= 0 
                          ? 'bg-green-900/30 text-green-400 border border-green-800/30' 
                          : 'bg-red-900/30 text-red-400 border border-red-800/30'
                      }`}>
                        {stats.monthlyGrowth >= 0 ? (
                          <FiArrowUpRight className="h-3.5 w-3.5 mr-1.5" />
                        ) : (
                          <FiArrowDownRight className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        {Math.abs(stats.monthlyGrowth || 0)}% ce mois-ci
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Partie droite : Boutons d'action */}
              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 mt-4 sm:mt-0">
                <button 
                  onClick={() => navigate('/deposit', { state: { from: 'wallet-section' } })}
                  className="btn btn-primary w-full sm:w-auto px-6 h-11 flex items-center justify-center gap-2 rounded-lg">
                  <FiPlus className="w-4 h-4" />
                  <span>Déposer</span>
                </button>
                <button 
                  onClick={() => navigate('/dashboard/withdraw')}
                  className="btn bg-white text-gray-700 hover:bg-gray-50 w-full sm:w-auto px-6 h-11 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                  <FiMinus className="w-4 h-4" />
                  <span>Retirer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total des investissements"
            value={stats?.totalInvestments || 0}
            icon={FiTrendingUp}
            color="primary"
            change={stats?.investmentGrowth || 0}
            suffix=" €"
          />
          <StatCard
            title="Gains totaux"
            value={stats?.totalEarnings || 0}
            icon={FiPieChart}
            color="success"
            change={stats?.earningsChange || 0}
            suffix=" €"
          />
          <StatCard
            title="Utilisateurs actifs"
            value={stats?.activeUsers || 0}
            icon={FiUsers}
            color="info"
            change={stats?.userGrowth || 0}
          />
          <StatCard
            title="Taux de rendement"
            value={stats?.roi || 0}
            suffix="%"
            icon={FiArrowUpRight}
            color="accent"
            change={stats?.roiChange}
          />
        </div>
        
        {/* Transactions récentes */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transactions récentes</h2>
            <button 
              onClick={() => navigate('/transactions')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              Voir tout <FiArrowRight className="ml-1 w-4 h-4" />
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {transactions && transactions.length > 0 ? (
              <div>
                {transactions.map((transaction, index) => (
                  <TransactionItem
                    key={index}
                    type={transaction.type}
                    amount={transaction.amount}
                    date={transaction.date}
                    status={transaction.status}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p>Aucune transaction récente</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Graphique de performance */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Graphique de performance à venir</p>
          </div>
        </div>
        

        {/* Section d'actions rapides et performances */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Carte Actions rapides */}
          <div className="bg-white dark:bg-gray-700/50 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600/30 overflow-hidden backdrop-blur-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/invest')}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800/50">
                      <FiTrendingUp className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Faire un investissement</span>
                  </div>
                  <FiArrowRight className="text-blue-600 dark:text-blue-400 w-4 h-4" />
                </button>
                
                <button
                  onClick={() => navigate('/withdraw')}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800/50">
                      <FiUpload className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Faire un retrait</span>
                  </div>
                  <FiArrowRight className="text-green-600 dark:text-green-400 w-4 h-4" />
                </button>
                
                <button
                  onClick={() => navigate('/referrals')}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800/50">
                      <FiUsers className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Parrainer un ami</span>
                  </div>
                  <FiArrowRight className="text-purple-600 dark:text-purple-400 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Section des performances */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performances</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Carte des gains mensuels */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Gains ce mois-ci</p>
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800/50">
                      <FiDollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats?.monthly_earnings?.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'XOF',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }) || '0 FCFA'}
                  </p>
                  {stats?.last_month_earnings ? (
                    <p className={`text-sm flex items-center ${stats.monthly_earnings >= stats.last_month_earnings ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {stats.monthly_earnings >= stats.last_month_earnings ? (
                        <FiArrowUpRight className="mr-1 w-4 h-4" />
                      ) : (
                        <FiArrowDownRight className="mr-1 w-4 h-4" />
                      )}
                      {Math.abs((stats.monthly_earnings - stats.last_month_earnings) / stats.last_month_earnings * 100).toFixed(1)}% vs mois dernier
                    </p>
                  ) : (
                    <p className="text-sm text-blue-600 dark:text-blue-400">Nouveau ce mois-ci</p>
                  )}
                </div>
                
                {/* Carte des dépôts totaux */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-900/20 dark:to-green-900/10 border border-green-100 dark:border-green-800/30">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Dépôts totaux</p>
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800/50">
                      <FiDownload className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats?.total_deposits?.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'XOF',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }) || '0 FCFA'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Dernier dépôt : {stats?.last_deposit_date ? new Date(stats.last_deposit_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'N/A'}
                  </p>
                </div>
                
                {/* Carte des retraits totaux */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-50/50 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Retraits totaux</p>
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-800/50">
                      <FiUpload className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats?.total_withdrawals?.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'XOF',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }) || '0 FCFA'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Dernier retrait : {stats?.last_withdrawal_date ? new Date(stats.last_withdrawal_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'Aucun retrait'}
                  </p>
                </div>
                
                {/* Carte de la dernière mise à jour */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-50/50 dark:from-gray-700/20 dark:to-gray-700/10 border border-gray-100 dark:border-gray-600/30">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Dernière mise à jour</p>
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                      <FiRefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {new Date(stats?.last_updated || new Date()).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(stats?.last_updated || new Date()).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;