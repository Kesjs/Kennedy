import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';
import DepositForm from '../../components/deposit/DepositForm';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import dashboardService from '../../services/api/dashboardService';

const DepositPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialDeposit, setIsInitialDeposit] = useState(false);
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifier si l'utilisateur est connecté et s'il s'agit d'un dépôt initial
  useEffect(() => {
    const checkInitialDeposit = async () => {
      if (!user) {
        toast.info('Veuillez vous connecter pour effectuer un dépôt');
        navigate('/login', { state: { from: location.pathname } });
        return;
      }

      try {
        // Vérifier si c'est un dépôt initial requis
        const requiresInitialDeposit = location.state?.requiresInitialDeposit || false;
        
        if (requiresInitialDeposit) {
          setIsInitialDeposit(true);
          toast.info('Un dépôt initial est requis pour continuer', { duration: 5000 });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la vérification du dépôt initial:', error);
        toast.error('Erreur lors du chargement des informations de dépôt');
        navigate('/dashboard');
      }
    };

    checkInitialDeposit();
  }, [user, navigate, location]);

  const handleDepositSuccess = async (depositData) => {
    try {
      // Mettre à jour les données utilisateur après un dépôt réussi
      await refreshUserData();
      
      // Afficher un message de succès
      toast.success(`Dépôt de ${depositData.amount} ${depositData.currency} effectué avec succès !`);
      
      // Rediriger vers le tableau de bord après un court délai
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données utilisateur:', error);
      toast.error('Dépôt réussi mais erreur lors de la mise à jour du profil');
      navigate('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Chargement des informations de paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Bouton de retour */}
        {!isInitialDeposit && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 mb-6"
          >
            <FaArrowLeft className="mr-2" /> Retour
          </button>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                {isInitialDeposit ? 'Dépôt initial requis' : 'Effectuer un dépôt'}
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {isInitialDeposit 
                  ? 'Effectuez votre premier dépôt pour débloquer toutes les fonctionnalités' 
                  : 'Ajoutez des fonds à votre compte pour commencer à investir'}
              </p>
              <div className="mt-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Les dépôts sont traités sous 24 heures. Vous recevrez une confirmation par email une fois le paiement validé.
                </p>
              </div>
            </div>
            
            <DepositForm 
              onDepositSuccess={handleDepositSuccess} 
              isInitialDeposit={isInitialDeposit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
