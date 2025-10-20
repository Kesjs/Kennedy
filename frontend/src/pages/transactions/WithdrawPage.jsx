import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import api from '../../services/api';
import {
  FiDollarSign,
  FiCreditCard,
  FiRefreshCw,
  FiArrowRight,
  FiArrowDown,
  FiArrowUp,
  FiCheck,
  FiAlertCircle,
  FiClock
} from 'react-icons/fi';
import { SiBitcoin, SiTether } from 'react-icons/si';
import { FaCoins } from 'react-icons/fa';
import { BsCurrencyBitcoin, BsCurrencyDollar } from 'react-icons/bs';

// Composant de chargement amélioré
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-12 space-y-4">
    <div className="animate-spin rounded-full h-14 w-14 border-4 border-purple-500 border-t-transparent"></div>
    <p className="text-gray-500 dark:text-gray-400">Chargement des informations de retrait...</p>
  </div>
);

// Options de méthode de retrait avec icônes professionnelles
const withdrawalMethods = [
  {
    id: 'crypto',
    name: 'Crypto-monnaie',
    icon: <BsCurrencyBitcoin className="w-5 h-5" />,
    description: 'Retrait instantané vers portefeuille crypto',
    color: 'from-purple-500 to-blue-500'
  },
  {
    id: 'bank',
    name: 'Virement bancaire',
    icon: <FiCreditCard className="w-5 h-5" />,
    description: 'Virement bancaire SEPA',
    color: 'from-green-500 to-teal-500'
  },
];

// Cryptomonnaies supportées avec icônes professionnelles
const cryptocurrencies = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: <SiBitcoin className="w-5 h-5 text-orange-500" />,
    color: 'bg-orange-500/10 border-orange-500/20'
  },
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    icon: <SiTether className="w-5 h-5 text-emerald-500" />,
    color: 'bg-emerald-500/10 border-emerald-500/20',
    networks: ['TRC20', 'ERC20']
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: <BsCurrencyDollar className="w-5 h-5 text-blue-500" />,
    color: 'bg-blue-500/10 border-blue-500/20',
    networks: ['TRC20', 'ERC20']
  },
  {
    id: 'trx',
    name: 'Tron',
    symbol: 'TRX',
    icon: <FaCoins className="w-5 h-5 text-red-500" />,
    color: 'bg-red-500/10 border-red-500/20'
  },
];

const WithdrawPage = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Vérification de l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur d'authentification</h2>
          <p className="text-gray-600 mb-6">Une erreur est survenue dans cette page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('crypto');
  const [selectedCrypto, setSelectedCrypto] = useState('usdt');
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [walletAddress, setWalletAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCryptoSelector, setShowCryptoSelector] = useState(false);
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);

  // Récupérer le solde du portefeuille
  const { data: walletBalance = { balance: 0, pending: 0 }, isLoading: isLoadingBalance, error: balanceError } = useQuery({
    queryKey: ['walletBalance'],
    queryFn: async () => {
      const response = await api.get('/api/wallet/balance');
      return response.data;
    },
    enabled: !!user && !!isAuthenticated, // Ne lance la requête que si l'utilisateur est authentifié
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      console.error('Error fetching wallet balance:', error);
    },
  });

  // Récupérer l'historique des retraits
  const { data: withdrawalHistory = [], isLoading: isLoadingHistory, error: historyError } = useQuery({
    queryKey: ['withdrawalHistory'],
    queryFn: async () => {
      const response = await api.get('/api/transactions/withdrawals');
      return response.data;
    },
    enabled: !!user && !!isAuthenticated, // Ne lance la requête que si l'utilisateur est authentifié
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      console.error('Error fetching withdrawal history:', error);
    },
  });

  // Récupérer les adresses de retrait enregistrées
  const { data: savedAddresses = [] } = useQuery({
    queryKey: ['savedWithdrawalAddresses'],
    queryFn: async () => {
      const response = await api.get('/api/wallet/withdrawal-addresses');
      return response.data;
    },
    enabled: !!user && !!isAuthenticated, // Ne lance la requête que si l'utilisateur est authentifié
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      console.error('Error fetching saved addresses:', error);
    },
  });

  // Mutation pour soumettre une demande de retrait
  const withdrawMutation = useMutation({
    mutationFn: (withdrawalData) => api.post('/api/transactions/withdraw', withdrawalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawalHistory'] });
      setSuccess('Votre demande de retrait a été soumise avec succès');
      setAmount('');
      setWalletAddress('');
      setError('');
    },
    onError: (error) => {
      console.error('Error submitting withdrawal:', error);
      setError(error.response?.data?.message || 'Erreur lors de la soumission du retrait');
      setSuccess('');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
    }
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();

    const withdrawalAmount = parseFloat(amount);
    const minWithdrawal = selectedMethod === 'crypto' ? 20 : 50;

    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    if (withdrawalAmount < minWithdrawal) {
      setError(`Le montant minimum de retrait est de ${minWithdrawal}€`);
      return;
    }

    if (withdrawalAmount > walletBalance.balance) {
      setError('Solde insuffisant pour effectuer ce retrait');
      return;
    }

    if (selectedMethod === 'crypto' && !walletAddress) {
      setError('Veuillez entrer une adresse de portefeuille valide');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await withdrawMutation.mutateAsync({
        amount: withdrawalAmount,
        method: selectedMethod,
        currency: selectedMethod === 'crypto' ? selectedCrypto : 'EUR',
        address: selectedMethod === 'crypto' ? walletAddress : undefined,
        network: selectedMethod === 'crypto' ? selectedNetwork : undefined,
      });
    } catch (err) {
      console.error('Withdrawal submission error:', err);
    }
  };

  const selectedCryptoData = cryptocurrencies.find(c => c.id === selectedCrypto) || cryptocurrencies[0];
  const selectedMethodData = withdrawalMethods.find(m => m.id === selectedMethod) || withdrawalMethods[0];
  const quickAmounts = [50, 100, 250, 500, 1000];

  if (isLoadingBalance || isLoadingHistory) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full h-full overflow-auto p-0 m-0 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Effectuer un retrait</h1>
          <p className="mt-1 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Retirez vos fonds vers votre portefeuille ou votre compte bancaire
          </p>
        </div>

        {/* Affichage des erreurs d'API */}
        {(balanceError || historyError) && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Erreur de chargement des données
              </h3>
            </div>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              {balanceError && <p>• Impossible de charger le solde du portefeuille</p>}
              {historyError && <p>• Impossible de charger l'historique des retraits</p>}
              <p className="mt-2">Veuillez rafraîchir la page ou réessayer plus tard.</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Rafraîchir la page
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire de retrait */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleWithdrawSubmit}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-5 sm:p-6">
                  {/* Solde disponible */}
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Solde disponible</h2>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(walletBalance.balance)}
                      </p>
                      {walletBalance.pending > 0 && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {walletBalance.pending.toFixed(2)} € en attente de retrait
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sélection de la méthode de retrait */}
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Méthode de retrait</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {withdrawalMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedMethod(method.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                            selectedMethod === method.id
                              ? `border-transparent bg-gradient-to-r ${method.color} text-white`
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex flex-col items-center text-center">
                            <div className={`p-2.5 rounded-lg mb-2 ${
                              selectedMethod === method.id
                                ? 'bg-white/20'
                                : `bg-gradient-to-r ${method.color.split(' ')[0]}/10 dark:bg-gray-600/30`
                            }`}>
                              {method.icon}
                            </div>
                            <span className={`font-medium ${
                              selectedMethod === method.id ? 'text-white' : 'text-gray-900 dark:text-white'
                            }`}>
                              {method.name}
                            </span>
                            <span className={`text-xs mt-1 ${
                              selectedMethod === method.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {method.description}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sélection de la cryptomonnaie (uniquement pour les retraits en crypto) */}
                  {selectedMethod === 'crypto' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sélectionnez une cryptomonnaie
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {cryptocurrencies.map((crypto) => (
                          <button
                            key={crypto.id}
                            type="button"
                            onClick={() => {
                              setSelectedCrypto(crypto.id);
                              if (crypto.networks && crypto.networks.length > 0) {
                                setSelectedNetwork(crypto.networks[0]);
                              }
                            }}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                              selectedCrypto === crypto.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-700/50'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className={`p-1.5 rounded-lg mr-3 ${crypto.color} border`}>
                                {crypto.icon}
                              </div>
                              <div className="text-left">
                                <div className={`font-medium ${
                                  selectedCrypto === crypto.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                                }`}>
                                  {crypto.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{crypto.symbol}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sélection du réseau (pour USDT et USDC) */}
                  {selectedMethod === 'crypto' && selectedCryptoData.networks && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Réseau de blockchain
                      </label>
                      <div className="flex gap-2">
                        {selectedCryptoData.networks.map((network) => (
                          <button
                            key={network}
                            type="button"
                            onClick={() => setSelectedNetwork(network)}
                            className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                              selectedNetwork === network
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                            }`}
                          >
                            {network}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Adresse du portefeuille (uniquement pour les retraits en crypto) */}
                  {selectedMethod === 'crypto' && (
                    <div className="mb-6">
                      <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Adresse de portefeuille {selectedCryptoData.symbol}
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <input
                          type="text"
                          id="walletAddress"
                          name="walletAddress"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                          placeholder={`Entrez votre adresse ${selectedCryptoData.symbol}`}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-4 py-3 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                          required={selectedMethod === 'crypto'}
                        />
                      </div>
                    </div>
                  )}

                  {/* Montant du retrait */}
                  <div className="mb-6">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Montant du retrait
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="amount"
                        id="amount"
                        value={amount}
                        onChange={handleAmountChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-3 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                        placeholder="0.00"
                        inputMode="decimal"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                          EUR
                        </span>
                      </div>
                    </div>

                    {/* Boutons de montant rapide */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {quickAmounts.map((quickAmount) => (
                        <button
                          key={quickAmount}
                          type="button"
                          onClick={() => setAmount(quickAmount.toString())}
                          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {quickAmount} €
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={isSubmitting || !amount}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r ${
                      selectedMethodData.color
                    } hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                      (isSubmitting || !amount) ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <FiRefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        Retirer {amount || '0.00'} €
                        <FiArrowRight className="ml-2 -mr-1 h-5 w-5" />
                      </>
                    )}
                  </button>

                  {/* Messages d'erreur et de succès */}
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-200 rounded">
                      <div className="flex">
                        <FiAlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0" />
                        <div>{error}</div>
                      </div>
                    </div>
                  )}

                  {success && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-200 rounded">
                      <div className="flex">
                        <FiCheck className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                        <div>{success}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>

            {/* Informations importantes sur les retraits */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Informations importantes</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-lg">
                    <div className="flex">
                      <FiAlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0" />
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Les retraits en crypto-monnaie nécessitent une confirmation par email pour des raisons de sécurité.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg">
                    <div className="flex">
                      <FiClock className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Les retraits en crypto sont traités dans les 24 heures. Les virements bancaires peuvent prendre 1 à 3 jours ouvrés.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 rounded-lg">
                    <div className="flex">
                      <FiCheck className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Les frais de retrait sont de 1% pour les cryptos et 2% pour les virements bancaires, avec un minimum de 2€.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Historique des retraits */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Derniers retraits</h2>

                {withdrawalHistory.length > 0 ? (
                  <div className="space-y-3">
                    {withdrawalHistory.slice(0, 3).map((withdrawal) => (
                      <div key={withdrawal.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mr-3">
                            <FiArrowUp className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              -{withdrawal.amount} {withdrawal.currency}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(withdrawal.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          withdrawal.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {withdrawal.status === 'completed' ? 'Complété' : 'En attente'}
                        </span>
                      </div>
                    ))}

                    {withdrawalHistory.length > 3 && (
                      <button 
                        onClick={() => navigate('/transactions')}
                        className="w-full mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline text-center transition-colors"
                      >
                        Voir tout l'historique
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aucun retrait récent</p>
                  </div>
                )}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Questions fréquentes</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quand vais-je recevoir mon argent ?</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Les retraits en crypto sont généralement traités dans les 24 heures. Les virements bancaires prennent 1 à 3 jours ouvrés.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Y a-t-il des frais de retrait ?</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Oui, les frais sont de 1% pour les cryptos et 2% pour les virements bancaires, avec un minimum de 2€.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Comment suivre mon retrait ?</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Une fois approuvé, vous recevrez un email de confirmation avec un lien pour suivre votre transaction sur la blockchain ou les détails du virement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
