import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import { 
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
import dashboardService from '../../services/api/dashboardService';

// Configuration des devises supportées
const CURRENCIES = [
  { code: 'EUR', name: 'Euro', symbol: '€', icon: <FaMoneyBillWave className="text-green-500" /> },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', icon: <FaBitcoin className="text-orange-500" /> },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', icon: <FaEthereum className="text-purple-500" /> },
  { code: 'USDT', name: 'Tether', symbol: '₮', icon: <SiTether className="text-emerald-500" /> }
];

// Méthodes de paiement disponibles par devise
const PAYMENT_METHODS = {
  EUR: [
    { id: 'bank_transfer', name: 'Virement bancaire', icon: <FaExchangeAlt /> },
    { id: 'credit_card', name: 'Carte de crédit', icon: <FaCreditCard /> }
  ],
  BTC: [
    { id: 'crypto', name: 'Transfert Bitcoin', icon: <FaBitcoin className="text-orange-500" /> }
  ],
  ETH: [
    { id: 'crypto', name: 'Transfert Ethereum', icon: <FaEthereum className="text-purple-500" /> }
  ],
  USDT: [
    { id: 'crypto', name: 'Transfert USDT', icon: <SiTether className="text-emerald-500" /> }
  ]
};

const DepositForm = ({ onDepositSuccess, isInitialDeposit = false }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [isLoading, setIsLoading] = useState(false);
  const [depositAddress, setDepositAddress] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [errors, setErrors] = useState({});
  const [isCrypto, setIsCrypto] = useState(false);

  // Mettre à jour la méthode de paiement et le statut crypto lorsque la devise change
  useEffect(() => {
    const cryptoCurrencies = ['BTC', 'ETH', 'USDT'];
    const isCryptoCurrency = cryptoCurrencies.includes(currency);
    setIsCrypto(isCryptoCurrency);
    
    if (isCryptoCurrency) {
      setPaymentMethod('crypto');
      // Simuler la récupération de l'adresse de dépôt
      // En production, vous devrez appeler votre API pour obtenir l'adresse
      const cryptoAddresses = {
        BTC: 'bc1q0ulp4sauly9sahsq7jswy94ane0ev9ksjtvpzn',
        ETH: '0x63eF5b765D8d408274172804D31fB0a2Ea5416c0',
        USDT: '0x63eF5b765D8d408274172804D31fB0a2Ea5416c0'
      };
      setDepositAddress(cryptoAddresses[currency]);
    } else {
      setPaymentMethod('bank_transfer');
      setDepositAddress('');
    }
  }, [currency]);
  const navigate = useNavigate();

  // Mettre à jour les méthodes de paiement lorsque la devise change
  useEffect(() => {
    // Réinitialiser la méthode de paiement lorsque la devise change
    const availableMethods = PAYMENT_METHODS[currency] || [];
    if (availableMethods.length > 0 && !availableMethods.some(method => method.id === paymentMethod)) {
      setPaymentMethod(availableMethods[0].id);
    }
  }, [currency]);

  // Réinitialiser l'état de copie après 3 secondes
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const validateForm = () => {
    const newErrors = {};
    const amountValue = parseFloat(amount);
    const minAmount = isInitialDeposit ? 50 : 10; // 50€ minimum pour le dépôt initial, 10€ sinon
    
    if (!amount || isNaN(amountValue)) {
      newErrors.amount = 'Veuillez entrer un montant valide';
    } else if (amountValue < minAmount) {
      newErrors.amount = `Le montant minimum est de ${minAmount} ${currency}`;
    } else if (amountValue > 10000) {
      newErrors.amount = `Le montant maximum est de 10 000 ${currency}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const depositData = {
        amount: parseFloat(amount),
        paymentMethod,
        currency,
        isInitialDeposit
      };
      
      const response = await dashboardService.createDeposit(depositData);
      
          // Pour les dépôts en crypto, on a déjà l'adresse, on confirme juste le dépôt
      if (paymentMethod === 'crypto') {
        toast.success('Dépôt en attente. Veuillez envoyer les fonds à l\'adresse indiquée.');
        return;
      }
      
      toast.success('Dépôt initié avec succès !');
      
      if (onDepositSuccess) {
        onDepositSuccess(response.data);
      }
      
      // Rediriger vers la page de confirmation si nécessaire
      // navigate('/dashboard/deposit/confirmation');
      
    } catch (error) {
      console.error('Erreur lors du dépôt:', error);
      toast.error(error.response?.data?.message || 'Une erreur est survenue lors du dépôt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Effectuer un dépôt
      </h2>
      
      {/* Affichage de l'adresse de dépôt pour les cryptomonnaies */}
      {(depositAddress && isCrypto) ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            {CURRENCIES.find(c => c.code === currency)?.icon || <FaExchangeAlt className="h-6 w-6 text-green-600 dark:text-green-400" />}
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-2">
            Envoyez {amount} {currency} à l'adresse suivante
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Veuillez effectuer un transfert de {amount} {currency} vers l'adresse ci-dessous pour compléter votre dépôt.
          </p>
          
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono break-all text-gray-800 dark:text-gray-200">
                {depositAddress}
              </code>
              <CopyToClipboard 
                text={depositAddress}
                onCopy={() => {
                  setIsCopied(true);
                  toast.success('Adresse copiée dans le presse-papier');
                }}
              >
                <button 
                  type="button" 
                  className="ml-2 p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  title="Copier l'adresse"
                >
                  {isCopied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                </button>
              </CopyToClipboard>
            </div>
          </div>
          
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900 p-4 rounded-md">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              <strong>Important :</strong> N'envoyez que des {CURRENCIES.find(c => c.code === currency)?.name || currency} ({currency}) à cette adresse. 
              L'envoi d'autres cryptomonnaies peut entraîner une perte définitive des fonds.
            </p>
          </div>
          
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setDepositAddress('');
                setAmount('');
              }}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Effectuer un nouveau dépôt
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {isInitialDeposit && (
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                <strong>Dépôt initial requis :</strong> Pour commencer à investir, effectuez un dépôt minimum de 50€.
              </p>
            </div>
          )}
          
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Devise
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.name} ({curr.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Montant du dépôt
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {CURRENCIES.find(c => c.code === currency)?.symbol || '€'}
                </span>
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                min={isInitialDeposit ? '50' : '10'}
                step="0.00000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder={isInitialDeposit ? '50.00' : '10.00'}
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {currency}
                </span>
              </div>
            </div>
            {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Méthode de paiement
            </label>
            <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(PAYMENT_METHODS[currency] || []).map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`relative rounded-lg border ${
                    paymentMethod === method.id
                      ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  } bg-white dark:bg-gray-800 p-4 flex flex-col cursor-pointer focus:outline-none`}
                >
                  <div className="flex items-center">
                    <span className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3">
                      {method.icon}
                    </span>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">
                      {method.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Résumé du dépôt</h4>
            <dl className="space-y-2">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 dark:text-gray-400">Montant :</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {amount || '0.00'} {currency}
                </dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 dark:text-gray-400">Frais :</dt>
                <dd className="font-medium text-gray-900 dark:text-white">0.00 {currency}</dd>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between text-sm font-semibold">
                <dt>Total à recevoir :</dt>
                <dd className="text-indigo-600 dark:text-indigo-400">
                  {amount || '0.00'} {currency}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !amount}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading || !amount ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Traitement...
                </>
              ) : isInitialDeposit ? (
                'Effectuer le dépôt initial'
              ) : (
                'Effectuer le dépôt'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DepositForm;
