import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import api from '../../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from '../../components/common/Loader';

// Données statiques pour les graphiques (à remplacer par des données réelles)
const portfolioData = [
  { name: 'Jan', value: 4000 },
  { name: 'Fév', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Avr', value: 4000 },
  { name: 'Mai', value: 6000 },
  { name: 'Juin', value: 8000 },
];

const investmentDistribution = [
  { name: 'Actions', value: 40 },
  { name: 'Crypto', value: 30 },
  { name: 'Immobilier', value: 20 },
  { name: 'Autres', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6m');

  // Récupérer les données du tableau de bord
  const { data: dashboardData, isLoading } = useQuery(
    ['userDashboard', timeRange],
    async () => {
      const response = await api.get(`/api/user/dashboard?range=${timeRange}`);
      return response.data;
    },
    {
      onError: (error) => {
        console.error('Error fetching dashboard data:', error);
      },
    }
  );

  // Récupérer les transactions récentes
  const { data: recentTransactions } = useQuery(
    ['recentTransactions'],
    async () => {
      const response = await api.get('/api/transactions/recent');
      return response.data;
    },
    {
      onError: (error) => {
        console.error('Error fetching recent transactions:', error);
      },
    }
  );

  // Récupérer les investissements actifs
  const { data: activeInvestments } = useQuery(
    ['activeInvestments'],
    async () => {
      const response = await api.get('/api/investments/active');
      return response.data;
    },
    {
      onError: (error) => {
        console.error('Error fetching active investments:', error);
      },
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  // Données pour les cartes de statistiques
  const statCards = [
    {
      title: 'Valeur du portefeuille',
      value: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(dashboardData?.portfolioValue || 0),
      change: dashboardData?.portfolioChange || 0,
      icon: (
        <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Bénéfices totaux',
      value: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(dashboardData?.totalProfit || 0),
      change: dashboardData?.profitChange || 0,
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: 'Investissements actifs',
      value: dashboardData?.activeInvestments || 0,
      change: 0,
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: 'Rendement mensuel',
      value: `${dashboardData?.monthlyReturn || 0}%`,
      change: dashboardData?.returnChange || 0,
      icon: (
        <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
        <p className="mt-1 text-gray-400">
          Bon retour, {user?.firstName} ! Voici un aperçu de vos performances.
        </p>
      </div>

      {/* Filtres de période */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          {['1m', '3m', '6m', '1a', 'Tout'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range === 'Tout' ? 'all' : range)}
              className={`px-3 py-1 text-sm rounded-md ${
                (range === 'Tout' && timeRange === 'all') || timeRange === range.toLowerCase()
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors">
            <svg className="w-5 h-5 inline-block mr-1 -mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exporter
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors">
            <svg className="w-5 h-5 inline-block mr-1 -mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nouvel investissement
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-5 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-opacity-20 bg-white">
                {card.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
                <p className={`text-xs ${card.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {card.change >= 0 ? '↑' : '↓'} {Math.abs(card.change)}% par rapport à la période précédente
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Valeur du portefeuille</h3>
            <div className="flex space-x-2">
              <button className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">Mois</button>
              <button className="px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded">Trimestre</button>
              <button className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">Année</button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    borderColor: '#374151',
                    borderRadius: '0.375rem',
                  }}
                  formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value), 'Valeur']}
                />
                <Legend />
                <Line type="monotone" dataKey="value" name="Valeur du portefeuille" stroke="#8B5CF6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-4">Répartition des actifs</h3>
          <div className="h-80 flex flex-col">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={investmentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {investmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value * 100),
                      name
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {investmentDistribution.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-300">{item.name}</span>
                  <span className="ml-auto text-sm font-medium text-white">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.value * 100)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dernières transactions et investissements actifs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white">Dernières transactions</h3>
          </div>
          <div className="divide-y divide-gray-700">
            {recentTransactions?.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${transaction.type === 'deposit' ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                      {transaction.type === 'deposit' ? (
                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-white">
                        {transaction.type === 'deposit' ? 'Dépôt' : 'Retrait'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.type === 'deposit' ? '+' : '-'} 
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(transaction.amount)}
                    </p>
                    <p className={`text-xs ${
                      transaction.status === 'completed' 
                        ? 'text-green-400' 
                        : transaction.status === 'pending' 
                          ? 'text-yellow-400' 
                          : 'text-red-400'
                    }`}>
                      {transaction.status === 'completed' ? 'Terminé' : transaction.status === 'pending' ? 'En attente' : 'Échoué'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-4 text-center">
              <button className="text-sm text-purple-400 hover:text-purple-300">
                Voir toutes les transactions →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Investissements actifs</h3>
            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
              {activeInvestments?.length || 0} actifs
            </span>
          </div>
          <div className="divide-y divide-gray-700">
            {activeInvestments?.slice(0, 4).map((investment) => (
              <div key={investment.id} className="p-4 hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-purple-500/10">
                      <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-white">{investment.name}</p>
                      <p className="text-xs text-gray-400">Début: {new Date(investment.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(investment.amount)}
                    </p>
                    <p className={`text-xs ${investment.return >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {investment.return >= 0 ? '+' : ''}{investment.return}%
                    </p>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-purple-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(100, (investment.durationElapsed / investment.totalDuration) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {Math.round((investment.durationElapsed / investment.totalDuration) * 100)}% complété
                </p>
              </div>
            ))}
            {(!activeInvestments || activeInvestments.length === 0) && (
              <div className="p-6 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-400">Aucun investissement actif pour le moment</p>
                <button className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors">
                  Découvrir les opportunités
                </button>
              </div>
            )}
            {activeInvestments?.length > 4 && (
              <div className="p-4 text-center">
                <button className="text-sm text-purple-400 hover:text-purple-300">
                  Voir tous les investissements →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Objectifs d'épargne */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-white">Objectifs d'épargne</h3>
          <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors">
            + Nouvel objectif
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-white">Voyage à Bali</h4>
                <p className="text-sm text-gray-400">Objectif: 3 500€</p>
              </div>
              <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full">En cours</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Économisé: 1 250€</span>
                <span className="text-white">35%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
              <p className="mt-2 text-xs text-gray-400">Objectif: 12/12/2023</p>
            </div>
          </div>

          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-white">Achat voiture</h4>
                <p className="text-sm text-gray-400">Objectif: 15 000€</p>
              </div>
              <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">À commencer</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Économisé: 0€</span>
                <span className="text-white">0%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="mt-2 text-xs text-gray-400">Objectif: 01/06/2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conseils et actualités */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Conseils et actualités</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700">
            <div className="h-40 bg-gradient-to-r from-purple-500 to-blue-500"></div>
            <div className="p-4">
              <span className="text-xs text-purple-400 font-medium">CONSEIL D'INVESTISSEMENT</span>
              <h4 className="text-white font-medium mt-1">Comment diversifier votre portefeuille en 2023</h4>
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">Découvrez les meilleures stratégies pour diversifier vos investissements et réduire les risques.</p>
              <button className="mt-3 text-sm text-purple-400 hover:text-purple-300">Lire l'article →</button>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700">
            <div className="h-40 bg-gradient-to-r from-blue-500 to-teal-500"></div>
            <div className="p-4">
              <span className="text-xs text-blue-400 font-medium">MARCHÉS</span>
              <h4 className="text-white font-medium mt-1">Les tendances du marché immobilier en 2023</h4>
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">Analyse des opportunités d'investissement immobilier à travers le monde cette année.</p>
              <button className="mt-3 text-sm text-blue-400 hover:text-blue-300">Lire l'article →</button>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700">
            <div className="h-40 bg-gradient-to-r from-teal-500 to-green-500"></div>
            <div className="p-4">
              <span className="text-xs text-teal-400 font-medium">ÉCONOMIE</span>
              <h4 className="text-white font-medium mt-1">L'impact de l'inflation sur vos investissements</h4>
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">Comprendre comment protéger votre épargne contre l'inflation en 2023.</p>
              <button className="mt-3 text-sm text-teal-400 hover:text-teal-300">Lire l'article →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
