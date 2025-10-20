import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import api from '../../services/api';
import { 
  FiDollarSign, 
  FiCreditCard, 
  FiRefreshCw,
  FiCopy,
  FiCheck,
  FiAlertCircle,
  FiArrowRight,
  FiArrowDown,
  FiArrowUp
} from 'react-icons/fi';
import { SiBitcoin, SiEthereum, SiTether } from 'react-icons/si';
import { BsCurrencyBitcoin, BsCurrencyDollar } from 'react-icons/bs';

// Composant de chargement amélioré
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-12 space-y-4">
    <div className="animate-spin rounded-full h-14 w-14 border-4 border-purple-500 border-t-transparent"></div>
    <p className="text-gray-500 dark:text-gray-400">Chargement des informations de paiement...</p>
  </div>
);

// Options de méthode de paiement avec icônes professionnelles
const paymentMethods = [
  { 
    id: 'crypto', 
    name: 'Crypto-monnaie', 
    icon: <BsCurrencyBitcoin className="w-5 h-5" />,
    description: 'Dépôt instantané avec cryptomonnaie',
    color: 'from-purple-500 to-blue-500'
  },
  { 
    id: 'bank', 
    name: 'Virement bancaire', 
    icon: <FiCreditCard className="w-5 h-5" />,
    description: 'Virement bancaire SEPA',
    color: 'from-green-500 to-teal-500'
  },
  { 
    id: 'card', 
    name: 'Carte bancaire', 
    icon: <FiCreditCard className="w-5 h-5" />,
    description: 'Paiement par carte (Visa/Mastercard)',
    color: 'from-blue-500 to-indigo-600'
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
    id: 'eth', 
    name: 'Ethereum', 
    symbol: 'ETH',
    icon: <SiEthereum className="w-5 h-5 text-purple-500" />,
    color: 'bg-purple-500/10 border-purple-500/20'
  },
  { 
    id: 'usdt', 
    name: 'Tether', 
    symbol: 'USDT',
    icon: <SiTether className="w-5 h-5 text-emerald-500" />,
    color: 'bg-emerald-500/10 border-emerald-500/20'
  },
  { 
    id: 'usdc', 
    name: 'USD Coin', 
    symbol: 'USDC',
    icon: <BsCurrencyDollar className="w-5 h-5 text-blue-500" />,
    color: 'bg-blue-500/10 border-blue-500/20'
  },
];

const DepositPage = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('crypto');
  const [selectedCrypto, setSelectedCrypto] = useState('btc');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [showCryptoSelector, setShowCryptoSelector] = useState(false);

  // Récupérer l'adresse de portefeuille de l'utilisateur
  const { data: userWallet, isLoading: isLoadingWallet } = useQuery({
    queryKey: ['userWallet'],
    queryFn: async () => {
      const response = await api.get('/api/wallet/address');
      return response.data;
    },
    onError: (error) => {
      console.error('Error fetching wallet address:', error);
    }
  });

  // Récupérer l'historique des dépôts
  const { data: depositHistory = [], refetch: refetchDeposits } = useQuery({
    queryKey: ['depositHistory'],
    queryFn: async () => {
      const response = await api.get('/api/transactions/deposits');
      return response.data;
    },
    onError: (error) => {
      console.error('Error fetching deposit history:', error);
    }
  });

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    
    const depositAmount = parseFloat(amount);
    
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Envoyer la demande de dépôt
      const response = await api.post('/api/transactions/deposit', {
        amount: depositAmount,
        method: selectedMethod,
        currency: selectedCrypto,
      });
      
      // Mettre à jour l'historique
      await refetchDeposits();
      
      // Afficher le message de succès
      setSuccess('Votre demande de dépôt a été enregistrée avec succès');
      
      // Réinitialiser le formulaire
      setAmount('');
      
    } catch (err) {
      console.error('Erreur lors du dépôt:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors du dépôt. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCryptoData = cryptocurrencies.find(c => c.id === selectedCrypto) || cryptocurrencies[0];
  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod) || paymentMethods[0];
  const quickAmounts = [50, 100, 250, 500, 1000];

  // Afficher le spinner de chargement si les données sont en cours de chargement
  if (isLoadingWallet) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full h-full overflow-auto p-0 m-0">
      <div className="w-full max-w-full p-4 sm:p-6">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Faire un dépôt</h1>
          <p className="mt-1 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Approvisionnez votre compte pour commencer à investir
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-4rem)]">
          {/* Formulaire de dépôt */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
              <div className="p-5 sm:p-6 flex-1 flex flex-col">
              {/* Sélection de la méthode de paiement */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Méthode de paiement</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
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

              {/* Sélection de la cryptomonnaie (uniquement pour les paiements en crypto) */}
              {selectedMethod === 'crypto' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sélectionnez une cryptomonnaie
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCryptoSelector(!showCryptoSelector)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <div className="flex items-center">
                        <div className={`p-1.5 rounded-lg mr-3 ${selectedCryptoData.color} border`}>
                          {selectedCryptoData.icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{selectedCryptoData.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{selectedCryptoData.symbol}</div>
                        </div>
                      </div>
                      {showCryptoSelector ? (
                        <FiArrowUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <FiArrowDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {showCryptoSelector && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg py-1 border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                        {cryptocurrencies.map((crypto) => (
                          <button
                            key={crypto.id}
                            type="button"
                            onClick={() => {
                              setSelectedCrypto(crypto.id);
                              setShowCryptoSelector(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 ${
                              selectedCrypto === crypto.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg mr-3 ${crypto.color} border`}>
                              {crypto.icon}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{crypto.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{crypto.symbol}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Montant du dépôt */}
              <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Montant du dépôt
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
                      {selectedMethod === 'crypto' ? selectedCryptoData.symbol : 'EUR'}
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
                      {quickAmount} {selectedMethod === 'crypto' ? selectedCryptoData.symbol : '€'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="mt-8">
                <button
                  type="submit"
                  onClick={handleDepositSubmit}
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
                      Déposer {amount || '0.00'} {selectedMethod === 'crypto' ? selectedCryptoData.symbol : '€'}
                      <FiArrowRight className="ml-2 -mr-1 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

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
        </div>

        {/* Panneau latéral avec informations */}
        <div className="lg:col-span-1 flex flex-col h-full">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Informations de paiement
              </h2>
              
              {selectedMethod === 'crypto' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Adresse de réception</p>
                    <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600">
                      <code className="text-sm font-mono text-gray-800 dark:text-gray-200 truncate">
                        {userWallet?.address || 'Chargement...'}
                      </code>
                      <button
                        onClick={() => copyToClipboard(userWallet?.address || '')}
                        className="ml-2 p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        title="Copier l'adresse"
                      >
                        {copied ? (
                          <FiCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <FiCopy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Envoyez uniquement {selectedCryptoData.name} ({selectedCryptoData.symbol}) à cette adresse.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-lg">
                    <div className="flex">
                      <FiAlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0" />
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Les dépôts peuvent prendre entre 1 et 30 minutes selon le réseau. Assurez-vous d'envoyer le bon type de crypto-monnaie.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {selectedMethod === 'bank' 
                      ? 'Veuillez effectuer un virement bancaire aux coordonnées qui vous seront communiquées après validation du formulaire.'
                      : 'Vous serez redirigé vers une passerelle de paiement sécurisée pour finaliser votre dépôt par carte.'}
                  </p>
                </div>
              )}

              {/* Historique des transactions récentes */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Derniers dépôts
                </h3>
                {depositHistory.length > 0 ? (
                  <div className="space-y-3">
                    {depositHistory.slice(0, 3).map((deposit) => (
                      <div key={deposit.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-3">
                            <FiArrowDown className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              +{deposit.amount} {deposit.currency}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(deposit.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          deposit.status === 'completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {deposit.status === 'completed' ? 'Complété' : 'En attente'}
                        </span>
                      </div>
                    ))}
                    {depositHistory.length > 3 && (
                      <button
                        onClick={() => navigate('/transactions')}
                        className="w-full mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline text-center"
                      >
                        Voir tout l'historique
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aucun dépôt récent</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>

          {/* Historique des dépôts */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Derniers dépôts</h3>
            </div>
            <div className="divide-y divide-gray-700">
              {depositHistory.length > 0 ? (
                depositHistory.map((deposit) => (
                  <div key={deposit.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {deposit.amount} {deposit.currency.toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(deposit.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          deposit.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : deposit.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {deposit.status === 'completed'
                          ? 'Terminé'
                          : deposit.status === 'pending'
                          ? 'En attente'
                          : 'Échoué'}
                      </span>
                    </div>
                    {deposit.txHash && (
                      <div className="mt-2">
                        <a
                          href={`https://blockexplorer.com/tx/${deposit.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
                        >
                          Voir sur l'explorateur
                          <svg
                            className="w-3 h-3 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-400">Aucun dépôt récent</p>
                </div>
              )}
            </div>
            {depositHistory.length > 0 && (
              <div className="px-6 py-3 bg-gray-800 text-right border-t border-gray-700">
                <a
                  href="/transactions/deposits"
                  className="text-sm font-medium text-purple-400 hover:text-purple-300"
                >
                  Voir tout l'historique →
                </a>
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="mt-6 bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Questions fréquentes</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300">Combien de temps prend un dépôt ?</h4>
                <p className="mt-1 text-sm text-gray-400">
                  Les dépôts en crypto sont généralement crédités après 1 à 6 confirmations sur le réseau (environ 5-30 minutes).
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300">Y a-t-il des frais de dépôt ?</h4>
                <p className="mt-1 text-sm text-gray-400">
                  Nous ne facturons pas de frais pour les dépôts. Cependant, des frais de réseau peuvent s'appliquer.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300">Mon dépôt n'apparaît pas, que faire ?</h4>
                <p className="mt-1 text-sm text-gray-400">
                  Vérifiez d'abord l'état de votre transaction sur l'explorateur de blocs. Si le problème persiste, contactez notre support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
