import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { 
  FaArrowLeft, 
  FaCreditCard, 
  FaExchangeAlt, 
  FaSpinner, 
  FaBitcoin, 
  FaEthereum,
  FaMoneyBillWave,
  FaCopy,
  FaCheck
} from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import api from '../../services/api';

// Configuration des devises supportées
const CURRENCIES = [
  { code: 'EUR', name: 'Euro', symbol: '€', icon: <FaMoneyBillWave className="text-green-500" /> },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', icon: <FaBitcoin className="text-orange-500" /> },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', icon: <FaEthereum className="text-purple-500" /> },
  { code: 'USDT', name: 'Tether', symbol: '₮', icon: <SiTether className="text-emerald-500" /> }
];

// Adresses de dépôt pour chaque crypto (à remplacer par des appels API réels)
const DEPOSIT_ADDRESSES = {
  BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  ETH: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  USDT: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503',
};

const DepositPage = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [depositAddress, setDepositAddress] = useState('');
  const [isInitialDeposit, setIsInitialDeposit] = useState(false);
  const [showCryptoForm, setShowCryptoForm] = useState(false);
  
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifier si l'utilisateur est connecté et s'il s'agit d'un dépôt initial
  useEffect(() => {
    if (!user) {
      toast.info('Veuillez vous connecter pour effectuer un dépôt');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const requiresInitialDeposit = location.state?.requiresInitialDeposit || false;
    if (requiresInitialDeposit) {
      setIsInitialDeposit(true);
      toast.info('Un dépôt initial est requis pour continuer', { duration: 5000 });
    }
  }, [user, navigate, location]);

  // Mettre à jour l'adresse de dépôt quand la devise change
  useEffect(() => {
    if (['BTC', 'ETH', 'USDT'].includes(currency)) {
      setDepositAddress(DEPOSIT_ADDRESSES[currency]);
      setShowCryptoForm(true);
    } else {
      setShowCryptoForm(false);
    }
  }, [currency]);

  const handleCopyAddress = () => {
    setIsAddressCopied(true);
    toast.success('Adresse copiée dans le presse-papier');
    setTimeout(() => setIsAddressCopied(false), 2000);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    setIsLoading(true);
    
    try {
      const depositData = {
        amount: parseFloat(amount),
        currency,
        isInitialDeposit,
        // Ajoutez d'autres données nécessaires ici
      };

      const response = await api.post('/api/transactions/deposit', depositData);
      
      if (response.data?.success) {
        toast.success('Dépôt initié avec succès !');
        await refreshUserData();
        
        if (isInitialDeposit) {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Erreur lors du dépôt:', error);
      toast.error(error.response?.data?.message || 'Une erreur est survenue lors du dépôt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
          >
            <FaArrowLeft className="mr-2" /> Retour
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isInitialDeposit ? 'Dépôt initial requis' : 'Effectuer un dépôt'}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {isInitialDeposit 
              ? 'Effectuez votre premier dépôt pour débloquer toutes les fonctionnalités' 
              : 'Ajoutez des fonds à votre compte pour commencer à investir'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <form onSubmit={handleDeposit} className="space-y-6">
            {/* Sélection de la devise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Choisissez une méthode de dépôt
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => setCurrency(curr.code)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                      currency === curr.code
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <span className="text-2xl mb-1">{curr.icon}</span>
                    <span className="text-sm font-medium">{curr.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formulaire de dépôt */}
            {showCryptoForm ? (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Envoie uniquement {currency} à cette adresse. L'envoi d'autres crypto-monnaies peut entraîner une perte définitive.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Montant en {currency}
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Montant en ${currency}`}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    step="0.00000001"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adresse de dépôt {currency}
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={depositAddress}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                    />
                    <CopyToClipboard text={depositAddress} onCopy={handleCopyAddress}>
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {isAddressCopied ? <FaCheck /> : <FaCopy />}
                      </button>
                    </CopyToClipboard>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Copiez cette adresse pour effectuer le dépôt depuis votre portefeuille externe
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-medium">Important :</span> Les dépôts peuvent prendre jusqu'à 30 minutes pour être crédités après 3 confirmations sur le réseau.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Montant en {currency}
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Montant en ${currency}`}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    step="0.01"
                    min="10"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Montant minimum : 10 {currency}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-medium">Information :</span> Les virements bancaires sont traités sous 24-48h ouvrées.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Traitement...
                  </>
                ) : (
                  `Déposer ${amount || ''} ${currency}`.trim()
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
