import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DepositForm from '../../components/deposit/DepositForm';
import { useAuth } from '../../contexts/SupabaseAuthContext';

const DepositPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (!user) {
      toast.info('Veuillez vous connecter pour effectuer un dépôt');
      navigate('/login', { state: { from: '/deposit' } });
      return;
    }
    setIsLoading(false);
  }, [user, navigate]);

  const handleDepositSuccess = (depositData) => {
    // Mettre à jour le solde de l'utilisateur dans le contexte d'authentification
    // Vous devrez peut-être implémenter cette logique dans votre contexte d'authentification
    
    // Afficher un message de succès
    toast.success(`Dépôt de ${depositData.amount}€ effectué avec succès !`);
    
    // Rediriger vers le tableau de bord après un court délai
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Effectuer un dépôt
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            Complétez votre portefeuille pour commencer à investir
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <DepositForm onDepositSuccess={handleDepositSuccess} />
          
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Les dépôts sont traités sous 24 heures. Vous recevrez une confirmation par email une fois le paiement validé.
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
