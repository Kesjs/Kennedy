import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import DepositForm from '../../components/deposit/DepositForm';
import { toast } from 'react-hot-toast';
import { FaArrowRight, FaLock, FaShieldAlt, FaCreditCard } from 'react-icons/fa';

const InitialDepositPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Récupérer l'URL de redirection depuis les paramètres de requête ou l'état de l'emplacement
  const returnTo = searchParams.get('returnTo') || location.state?.from || '/dashboard';

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (!user) {
      toast.info('Veuillez vous connecter pour effectuer un dépôt');
      navigate('/login', { state: { from: '/initial-deposit', ...location.state } });
      return;
    }
    
    setIsLoading(false);
  }, [user, navigate, location]);

  const handleDepositSuccess = async (depositData) => {
    setIsProcessing(true);
    
    try {
      // Afficher un message de succès
      toast.success(`Dépôt initial de ${depositData.amount}€ effectué avec succès !`);
      
      // Rediriger vers la page d'origine après un court délai
      setTimeout(() => {
        // Nettoyer l'état de navigation pour éviter les boucles de redirection
        navigate(returnTo, { replace: true, state: null });
      }, 2000);
    } catch (error) {
      console.error('Erreur lors du traitement du dépôt initial:', error);
      toast.error('Une erreur est survenue lors du traitement de votre dépôt');
      setIsProcessing(false);
    }
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
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Dépôt initial requis
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Pour commencer à utiliser notre plateforme, veuillez effectuer un dépôt initial
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Pourquoi un dépôt initial ?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-1">
                    <FaShieldAlt className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Sécurité renforcée</span> - Nous vérifions l'identité de nos utilisateurs pour assurer un environnement sécurisé.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-1">
                    <FaCreditCard className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Accès complet</span> - Profitez de toutes les fonctionnalités de notre plateforme après votre premier dépôt.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-1">
                    <FaLock className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">100% sécurisé</span> - Vos fonds sont protégés par des mesures de sécurité avancées.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Effectuez votre dépôt initial
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <DepositForm 
                  onDepositSuccess={handleDepositSuccess} 
                  isProcessing={isProcessing}
                  minAmount={50}
                />
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  En effectuant un dépôt, vous acceptez nos{' '}
                  <a href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    conditions d'utilisation
                  </a>{' '}
                  et notre{' '}
                  <a href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    politique de confidentialité
                  </a>.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 sm:px-8 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Vous avez des questions ?{' '}
                <a href="/support" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  Contactez notre support
                </a>
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-800 dark:text-indigo-100 dark:hover:bg-indigo-700"
              >
                Plus tard <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialDepositPage;
