import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from '../../components/common/Loader';

const ReferralPage = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Récupérer les données de parrainage
  const { data: referralData, isLoading } = useQuery({
    queryKey: ['referralData'],
    queryFn: async () => {
      const response = await api.get('/api/referrals/stats');
      return response.data;
    },
    enabled: !!user,
    retry: 2,
    onError: (error) => {
      console.error('Error fetching referral data:', error);
    },
  });

  // Récupérer l'historique des parrainages
  const { data: referralHistory = [] } = useQuery({
    queryKey: ['referralHistory'],
    queryFn: async () => {
      const response = await api.get('/api/referrals/history');
      return response.data;
    },
    enabled: !!user,
    retry: 2,
    onError: (error) => {
      console.error('Error fetching referral history:', error);
    },
  });

  // Générer le lien de parrainage
  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode}`;

  // Copier le lien dans le presse-papiers
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Données pour le graphique (exemple)
  const referralStats = [
    { name: 'Jan', invites: 3, active: 2, earnings: 150 },
    { name: 'Fév', invites: 5, active: 4, earnings: 320 },
    { name: 'Mar', invites: 7, active: 6, earnings: 480 },
    { name: 'Avr', invites: 4, active: 3, earnings: 210 },
    { name: 'Mai', invites: 6, active: 5, earnings: 390 },
    { name: 'Juin', invites: 8, active: 7, earnings: 520 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Programme de parrainage</h1>
        <p className="mt-1 text-gray-400">
          Parrainez des amis et gagnez des récompenses
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500/10">
              <svg
                className="w-6 h-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Filleuls actifs</p>
              <p className="text-xl font-semibold text-white">
                {referralData?.activeReferrals || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500/10">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total des parrainages</p>
              <p className="text-xl font-semibold text-white">
                {referralData?.totalReferrals || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500/10">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Gains totaux</p>
              <p className="text-xl font-semibold text-white">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(referralData?.totalEarnings || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500/10">
              <svg
                className="w-6 h-6 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h1m0 0v1m0-1h.01M12 10v3m0 4v.01M12 17v.01M12 21a9 9 0 100-18 9 9 0 000 18z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Taux de conversion</p>
              <p className="text-xl font-semibold text-white">
                {referralData?.conversionRate || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lien de parrainage */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-medium text-white mb-4">Votre lien de parrainage</h2>
            <p className="text-sm text-gray-400 mb-4">
              Partagez ce lien avec vos amis et gagnez {referralData?.commissionRate || 5}% de leurs dépôts
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white"
                  title="Copier le lien"
                >
                  {copied ? (
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap"
                >
                  {copied ? 'Copié !' : 'Copier le lien'}
                </button>
                <button className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-300 mb-1">Votre code de parrainage</h3>
                <div className="flex items-center">
                  <code className="text-lg font-bold text-purple-400">{user?.referralCode}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user?.referralCode || '');
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="ml-2 p-1 text-gray-400 hover:text-white"
                    title="Copier le code"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-300 mb-1">Commission</h3>
                <p className="text-2xl font-bold text-green-400">{referralData?.commissionRate || 5}%</p>
                <p className="text-xs text-gray-400 mt-1">sur chaque dépôt de vos filleuls</p>
              </div>
            </div>
          </div>

          {/* Graphique des statistiques */}
          <div className="mt-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-white">Statistiques de parrainage</h2>
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    activeTab === 'overview' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Aperçu
                </button>
                <button
                  onClick={() => setActiveTab('earnings')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    activeTab === 'earnings' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Gains
                </button>
                <button
                  onClick={() => setActiveTab('referrals')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    activeTab === 'referrals' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Parrainages
                </button>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={referralStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      borderColor: '#4B5563',
                      borderRadius: '0.375rem',
                    }}
                    formatter={(value) => [`${value}`, activeTab === 'earnings' ? 'Gains (€)' : 'Personnes']}
                  />
                  <Legend />
                  {activeTab === 'overview' && (
                    <>
                      <Bar dataKey="invites" name="Invitations" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="active" name="Actifs" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </>
                  )}
                  {activeTab === 'earnings' && (
                    <Bar dataKey="earnings" name="Gains" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  )}
                  {activeTab === 'referrals' && (
                    <Bar dataKey="invites" name="Nouveaux parrainages" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Derniers parrainages */}
        <div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Derniers parrainages</h3>
            </div>
            <div className="divide-y divide-gray-700">
              {referralHistory.length > 0 ? (
                referralHistory.slice(0, 5).map((referral) => (
                  <div key={referral.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {referral.referredEmail}
                        </p>
                        <p className="text-xs text-gray-400">
                          Inscrit le {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          referral.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {referral.status === 'active' ? 'Actif' : 'En attente'}
                      </span>
                    </div>
                    {referral.earnings > 0 && (
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-400">Généré:</span>
                        <span className="text-sm font-medium text-green-400">
                          +{referral.earnings.toFixed(2)} €
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-400">Aucun parrainage récent</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Partagez votre lien de parrainage pour inviter des amis
                  </p>
                </div>
              )}
            </div>
            {referralHistory.length > 0 && (
              <div className="px-6 py-3 bg-gray-800 text-right border-t border-gray-700">
                <a
                  href="/referrals/history"
                  className="text-sm font-medium text-purple-400 hover:text-purple-300"
                >
                  Voir tout l'historique →
                </a>
              </div>
            )}
          </div>

          {/* Comment ça marche */}
          <div className="mt-6 bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Comment ça marche ?</h3>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 bg-purple-500 text-white rounded-full text-xs font-bold mr-3 flex-shrink-0">1</span>
                <span className="text-sm text-gray-300">Partagez votre lien de parrainage avec vos amis</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 bg-purple-500 text-white rounded-full text-xs font-bold mr-3 flex-shrink-0">2</span>
                <span className="text-sm text-gray-300">Ils s'inscrivent et effectuent leur premier dépôt</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 bg-purple-500 text-white rounded-full text-xs font-bold mr-3 flex-shrink-0">3</span>
                <span className="text-sm text-gray-300">Recevez {referralData?.commissionRate || 5}% de leurs dépôts en récompense</span>
              </li>
            </ol>
            
            <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <h4 className="text-sm font-medium text-purple-300 mb-2">Bonus supplémentaire</h4>
              <p className="text-xs text-purple-200">
                Gagnez un bonus de 10€ pour chaque filleul qui investit plus de 500€ dans son premier mois.
              </p>
            </div>
          </div>

          {/* Boutons de partage */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
              Twitter
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium rounded-md transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
              Facebook
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polygon points="22,6 12,13 2,6 "></polygon>
              </svg>
              Email
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.77.962-.94 1.163-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.795-1.484-1.784-1.66-2.087-.173-.297-.018-.458.13-.605.136-.135.298-.355.446-.534.148-.173.198-.296.298-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.207-.242-.579-.488-.5-.669-.51-.173-.012-.371-.01-.57-.01-.198 0-.52.074-.792.361-.272.3-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.078 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.869.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.345m-5.446 7.443h-.004a9.87 9.87 0 01-5.031-1.378l-.366-.222-3.744.982.998-3.648-.235-.372a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.437-9.885 9.888-9.885 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.723 1.47h.006c6.553 0 11.886-5.336 11.893-11.896a11.821 11.821 0 00-3.48-8.413z"></path>
              </svg>
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
