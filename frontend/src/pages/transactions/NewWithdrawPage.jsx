import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShieldAlt, FaExchangeAlt, FaClock, FaCheckCircle, FaWallet, FaInfoCircle } from 'react-icons/fa';
import { SiBitcoin, SiTether, SiLitecoin } from 'react-icons/si';
import { BsCurrencyDollar, BsBank2 } from 'react-icons/bs';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

// Composant pour les avantages du retrait
const BenefitItem = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
    <div className="flex-shrink-0 p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
      {icon}
    </div>
    <div>
      <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

// Composant pour les étapes du processus
const Step = ({ number, title, description, isLast = false }) => (
  <div className="relative">
    <div className={`flex items-center ${!isLast ? 'pb-10' : ''}`}>
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
        {number}
      </div>
      <div className="ml-4">
        <h4 className="text-lg font-medium text-white">{title}</h4>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
    {!isLast && (
      <div className="absolute left-5 top-10 h-full w-0.5 bg-gray-700 -z-10"></div>
    )}
  </div>
);

const NewWithdrawPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('crypto');
  const [selectedCrypto, setSelectedCrypto] = useState('usdt');
  const [walletAddress, setWalletAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletBalance, setWalletBalance] = useState({ balance: 0, pending: 0 });
  
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Vérification de l'authentification
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [authLoading, isAuthenticated, navigate, location]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center border border-gray-200 dark:border-gray-700">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Erreur d'authentification</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Veuillez vous connecter pour accéder à cette page</p>
          <button
            onClick={() => navigate('/login', { state: { from: location.pathname } })}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow hover:shadow-md"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // Données des méthodes de retrait
  const withdrawalMethods = [
    {
      id: 'crypto',
      name: 'Crypto-monnaie',
      icon: <FaWallet className="w-5 h-5" />,
      description: 'Retrait instantané vers votre portefeuille crypto',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'bank',
      name: 'Virement bancaire',
      icon: <BsBank2 className="w-5 h-5" />,
      description: 'Virement bancaire SEPA sous 24-48h',
      color: 'from-green-500 to-teal-600'
    },
  ];

  // Données des cryptomonnaies
  const cryptocurrencies = [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: <SiBitcoin className="w-5 h-5 text-orange-500" />,
      color: 'bg-orange-500/10 border-orange-500/20',
      networks: ['BTC']
    },
    {
      id: 'usdt',
      name: 'Tether',
      symbol: 'USDT',
      icon: <SiTether className="w-5 h-5 text-emerald-500" />,
      color: 'bg-emerald-500/10 border-emerald-500/20',
      networks: ['TRC20', 'ERC20']
    },
  ];

  // Charger le solde du portefeuille
  useEffect(() => {
    const loadWalletBalance = async () => {
      try {
        const response = await api.get('/wallet/balance');
        setWalletBalance({
          balance: response.data.balance || 0,
          pending: response.data.pending || 0
        });
      } catch (error) {
        console.error('Erreur lors du chargement du solde:', error);
        toast.error('Impossible de charger le solde du portefeuille');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadWalletBalance();
    } else {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, navigate, location]);

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    if (parseFloat(amount) > walletBalance.balance) {
      toast.error('Solde insuffisant pour effectuer ce retrait');
      return;
    }

    if (selectedMethod === 'crypto' && !walletAddress) {
      toast.error('Veuillez entrer une adresse de portefeuille valide');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/api/transactions/withdraw', {
        amount: parseFloat(amount),
        method: selectedMethod,
        currency: selectedMethod === 'crypto' ? selectedCrypto.toUpperCase() : 'EUR',
        address: selectedMethod === 'crypto' ? walletAddress : undefined,
        network: selectedMethod === 'crypto' ? 'TRC20' : undefined,
      });

      toast.success('Votre demande de retrait a été soumise avec succès');
      setAmount('');
      setWalletAddress('');
      
      // Recharger le solde
      const response = await api.get('/api/wallet/balance');
      setWalletBalance({
        balance: response.data.balance || 0,
        pending: response.data.pending || 0
      });
      
    } catch (error) {
      console.error('Erreur lors du retrait:', error);
      toast.error(error.response?.data?.message || 'Une erreur est survenue lors du retrait');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCryptoData = cryptocurrencies.find(c => c.id === selectedCrypto) || cryptocurrencies[0];
  const selectedMethodData = withdrawalMethods.find(m => m.id === selectedMethod) || withdrawalMethods[0];
  const quickAmounts = [50, 100, 250, 500, 1000];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 md:p-6 lg:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* En-tête avec bouton retour */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/20 transition-colors mr-4 text-gray-800 dark:text-white"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Effectuer un retrait</h1>
            <p className="text-gray-600 dark:text-gray-400">Retirez vos fonds en toute sécurité</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de retrait */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden shadow-sm"
            >
              <div className="p-6">
                {/* Solde disponible */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-700 dark:text-gray-400 mb-2">Solde disponible</h2>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700/50">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(walletBalance.balance)}
                    </p>
                    {walletBalance.pending > 0 && (
                      <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                        <FaClock className="inline mr-1" />
                        {walletBalance.pending.toFixed(2)} € en attente de retrait
                      </p>
                    )}
                  </div>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleWithdrawSubmit}>
                  {/* Montant */}
                  <div className="mb-6">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Montant du retrait
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">€</span>
                      </div>
                      <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    
                    {/* Montants rapides */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {quickAmounts.map((quickAmount) => (
                        <button
                          key={quickAmount}
                          type="button"
                          onClick={() => setAmount(quickAmount.toString())}
                          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors text-gray-800 dark:text-white"
                        >
                          {quickAmount} €
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Méthode de retrait */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Méthode de retrait
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {withdrawalMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedMethod(method.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            selectedMethod === method.id
                              ? `border-transparent bg-gradient-to-r ${method.color} text-white`
                              : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                          }`}
                        >
                          <div className="flex flex-col">
                            <div className={`p-2 rounded-lg mb-2 w-10 ${
                              selectedMethod === method.id
                                ? 'bg-white/20'
                                : `bg-${method.color.split(' ')[0]}/10`
                            }`}>
                              {method.icon}
                            </div>
                            <span className="font-medium">{method.name}</span>
                            <span className="text-xs mt-1 opacity-80">{method.description}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sélection de la cryptomonnaie (si méthode crypto) */}
                  {selectedMethod === 'crypto' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Cryptomonnaie
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {cryptocurrencies.map((crypto) => (
                          <button
                            key={crypto.id}
                            type="button"
                            onClick={() => setSelectedCrypto(crypto.id)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              selectedCrypto === crypto.id
                                ? 'border-indigo-500 bg-indigo-500/10'
                                : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className={`p-1.5 rounded-lg mr-3 ${crypto.color}`}>
                                {crypto.icon}
                              </div>
                              <div className="text-left">
                                <div className="font-medium">{crypto.name}</div>
                                <div className="text-xs text-gray-400">{crypto.symbol}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Adresse du portefeuille (si méthode crypto) */}
                  {selectedMethod === 'crypto' && (
                    <div className="mb-6">
                      <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-300 mb-2">
                        Adresse de votre portefeuille {selectedCryptoData.name}
                      </label>
                      <input
                        type="text"
                        id="walletAddress"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder={`Entrez votre adresse ${selectedCryptoData.name}`}
                        required
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        Assurez-vous que l'adresse est correcte. Les transactions sont irréversibles.
                      </p>
                    </div>
                  )}

                  {/* Informations bancaires (si méthode virement) */}
                  {selectedMethod === 'bank' && (
                    <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
                      <div className="flex items-start">
                        <FaInfoCircle className="text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-blue-200">Virement bancaire</h4>
                          <p className="text-sm text-blue-300">
                            Les virements bancaires sont traités sous 1 à 3 jours ouvrables. 
                            Veuillez vous assurer que votre compte bancaire est vérifié avant de procéder.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bouton de soumission */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                      isSubmitting
                        ? 'bg-indigo-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                    }`}
                  >
                    {isSubmitting ? 'Traitement...' : 'Demander un retrait'}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Sécurité et avantages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <BenefitItem
                icon={<FaShieldAlt className="w-5 h-5" />}
                title="Sécurité maximale"
                description="Toutes les transactions sont cryptées et sécurisées"
              />
              <BenefitItem
                icon={<FaExchangeAlt className="w-5 h-5" />}
                title="Traitement rapide"
                description="Retraits traités dans les plus brefs délais"
              />
            </div>
          </div>

          {/* Étapes et informations */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6"
            >
              <h2 className="text-xl font-bold mb-6">Comment effectuer un retrait ?</h2>
              <div className="space-y-6">
                <Step 
                  number="1" 
                  title="Sélectionnez le montant" 
                  description="Entrez le montant que vous souhaitez retirer"
                />
                <Step 
                  number="2" 
                  title="Choisissez la méthode" 
                  description="Sélectionnez entre cryptomonnaie ou virement bancaire"
                />
                <Step 
                  number="3" 
                  title="Confirmez les détails" 
                  description="Vérifiez que toutes les informations sont correctes"
                  isLast
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6"
            >
              <h3 className="font-medium text-gray-300 mb-3">Frais de retrait</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between">
                  <span>Retrait en cryptomonnaie</span>
                  <span className="font-medium text-white">0.5%</span>
                </li>
                <li className="flex justify-between">
                  <span>Virement bancaire (SEPA)</span>
                  <span className="font-medium text-white">1.5% (min. 5€)</span>
                </li>
                <li className="flex justify-between">
                  <span>Virement express (24h)</span>
                  <span className="font-medium text-white">3% (min. 10€)</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  <FaInfoCircle className="inline mr-1" />
                  Les frais peuvent varier en fonction du réseau et des conditions du marché.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewWithdrawPage;
