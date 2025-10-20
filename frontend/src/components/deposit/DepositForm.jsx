import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaCreditCard, FaExchangeAlt, FaSpinner } from 'react-icons/fa';
import dashboardService from '../../services/api/dashboardService';

const PAYMENT_METHODS = [
  { id: 'bank_transfer', name: 'Virement bancaire', icon: <FaExchangeAlt /> },
  { id: 'credit_card', name: 'Carte de crédit', icon: <FaCreditCard /> },
];

const DepositForm = ({ onDepositSuccess }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const amountValue = parseFloat(amount);
    
    if (!amount || isNaN(amountValue)) {
      newErrors.amount = 'Veuillez entrer un montant valide';
    } else if (amountValue < 10) {
      newErrors.amount = 'Le montant minimum est de 10 €';
    } else if (amountValue > 10000) {
      newErrors.amount = 'Le montant maximum est de 10 000 €';
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
        currency: 'EUR',
      };
      
      const response = await dashboardService.createDeposit(depositData);
      
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
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Montant (€)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">€</span>
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              min="10"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 ${
                errors.amount ? 'border-red-500' : ''
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Méthode de paiement
          </label>
          <div className="grid gap-4 grid-cols-2">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === method.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">
                    {method.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {method.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                Traitement...
              </>
            ) : (
              'Confirmer le dépôt'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepositForm;
