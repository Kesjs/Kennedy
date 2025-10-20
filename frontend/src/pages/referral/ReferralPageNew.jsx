import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import api from '../../services/api';
import {
  FiUsers,
  FiDollarSign,
  FiLink,
  FiCopy,
  FiCheck,
  FiTrendingUp,
  FiGift,
  FiShare2,
  FiEye,
  FiCalendar,
  FiArrowRight
} from 'react-icons/fi';

const ReferralPageNew = ({ initialTab = 'overview' }) => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Mettre à jour l'onglet actif si initialTab change
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Vérification de l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Accès restreint</h2>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder au programme de parrainage.</p>
        </div>
      </div>
    );
  }

  // Récupérer les données de parrainage
  const { data: referralData, isLoading: isLoadingStats, error: statsError } = useQuery({
    queryKey: ['referralData'],
    queryFn: async () => {
      const response = await api.get('/api/referrals/stats');
      return response.data;
    },
    enabled: !!user && !!isAuthenticated,
    retry: 2,
    onError: (error) => {
      console.error('Error fetching referral data:', error);
    },
  });

  // Récupérer l'historique des parrainages
  const { data: referralHistory = [], isLoading: isLoadingHistory, error: historyError } = useQuery({
    queryKey: ['referralHistory'],
    queryFn: async () => {
      const response = await api.get('/api/referrals/history');
      return response.data;
    },
    enabled: !!user && !!isAuthenticated,
    retry: 2,
    onError: (error) => {
      console.error('Error fetching referral history:', error);
    },
  });

  // Récupérer les commissions
  const { data: commissions = [], isLoading: isLoadingCommissions } = useQuery({
    queryKey: ['referralCommissions'],
    queryFn: async () => {
      const response = await api.get('/api/referrals/commissions');
      return response.data;
    },
    enabled: !!user && !!isAuthenticated,
    retry: 2,
    onError: (error) => {
      console.error('Error fetching commissions:', error);
    },
  });

  // Générer le lien de parrainage
  const referralCode = user?.referralCode || user?.id?.substring(0, 8) || 'USER123';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  // Copier le lien dans le presse-papiers
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Données par défaut si l'API n'est pas disponible
  const defaultStats = {
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    clicksThisMonth: 0,
    conversionRate: 0
  };

  const stats = referralData || defaultStats;

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: FiEye },
    { id: 'link', name: 'Mon lien', icon: FiLink },
    { id: 'referrals', name: 'Mes filleuls', icon: FiUsers },
    { id: 'commissions', name: 'Commissions', icon: FiDollarSign },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <FiUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total filleuls</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReferrals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <FiTrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Filleuls actifs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeReferrals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <FiDollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gains totaux</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEarnings}€</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <FiGift className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En attente</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingEarnings}€</p>
            </div>
          </div>
        </div>
      </div>

      {/* Programme de parrainage */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Programme de parrainage Gazoduc Invest</h2>
          <p className="text-blue-100 mb-6">
            Partagez Gazoduc Invest avec vos amis et gagnez des récompenses pour chaque personne qui s'inscrit et investit grâce à votre lien.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <FiShare2 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">1. Partagez</h3>
              <p className="text-sm text-blue-100">Partagez votre lien unique avec vos amis</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <FiUsers className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">2. Ils s'inscrivent</h3>
              <p className="text-sm text-blue-100">Vos amis créent un compte et investissent</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <FiDollarSign className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">3. Vous gagnez</h3>
              <p className="text-sm text-blue-100">Recevez 5% de leurs investissements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLink = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Votre lien de parrainage</h3>
        <div className="flex items-center space-x-3">
          <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border">
            <code className="text-sm text-gray-700 dark:text-gray-300 break-all">{referralLink}</code>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
            <span className="ml-2">{copied ? 'Copié!' : 'Copier'}</span>
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
          Partagez ce lien avec vos amis pour qu'ils puissent s'inscrire avec votre code de parrainage.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Code de parrainage</h3>
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border">
            <code className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">{referralCode}</code>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(referralCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FiCopy className="h-4 w-4 mr-2" />
            Copier le code
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
          Vos amis peuvent également utiliser ce code lors de leur inscription.
        </p>
      </div>
    </div>
  );

  const renderReferrals = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mes filleuls</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Liste de toutes les personnes qui se sont inscrites avec votre lien
          </p>
        </div>
        <div className="overflow-x-auto">
          {referralHistory.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Commission gagnée
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {referralHistory.map((referral, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {referral.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {referral.name || 'Utilisateur anonyme'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {referral.email || 'Email masqué'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(referral.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        referral.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {referral.status === 'active' ? 'Actif' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {referral.commission || 0}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <FiUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun filleul pour le moment</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Commencez à partager votre lien pour voir vos premiers filleuls apparaître ici.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCommissions = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <FiDollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total gagné</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEarnings}€</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <FiCalendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ce mois-ci</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingEarnings}€</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <FiTrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taux de commission</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">5%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Historique des commissions</h3>
        </div>
        <div className="overflow-x-auto">
          {commissions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Filleul
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Investissement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {commissions.map((commission, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(commission.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {commission.referralName || 'Utilisateur anonyme'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {commission.investmentAmount}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                      +{commission.amount}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        commission.status === 'paid' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {commission.status === 'paid' ? 'Payé' : 'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <FiDollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune commission pour le moment</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vos commissions apparaîtront ici lorsque vos filleuls commenceront à investir.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'link':
        return renderLink();
      case 'referrals':
        return renderReferrals();
      case 'commissions':
        return renderCommissions();
      default:
        return renderOverview();
    }
  };

  if (isLoadingStats || isLoadingHistory || isLoadingCommissions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des données de parrainage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto p-0 m-0 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Programme de parrainage</h1>
          <p className="mt-1 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Partagez Gazoduc Invest et gagnez des récompenses
          </p>
        </div>

        {/* Affichage des erreurs d'API */}
        {(statsError || historyError) && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-500 text-xl mr-2">⚠️</div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Erreur de chargement des données
              </h3>
            </div>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>Certaines données de parrainage ne peuvent pas être chargées. Les fonctionnalités de base restent disponibles.</p>
            </div>
          </div>
        )}

        {/* Navigation par onglets */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenu de l'onglet actif */}
        {renderContent()}
      </div>
    </div>
  );
};

export default ReferralPageNew;
