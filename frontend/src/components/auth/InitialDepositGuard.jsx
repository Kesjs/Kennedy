import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import authService from '../../services/api/authService';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Composant de garde qui redirige vers la page de dépôt initial si l'utilisateur n'a pas effectué de dépôt initial
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Les composants enfants à afficher si l'utilisateur a effectué un dépôt initial
 * @returns {JSX.Element} Le composant de garde
 */
const InitialDepositGuard = ({ children }) => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkInitialDeposit = async () => {
      if (!isAuthenticated) {
        // Si l'utilisateur n'est pas connecté, on ne fait rien (le ProtectedRoute gérera la redirection)
        setIsChecking(false);
        return;
      }

      try {
        // Vérifier si l'utilisateur a effectué un dépôt initial
        const userProfile = await authService.getUserProfile();
        
        // Si l'utilisateur n'a pas effectué de dépôt initial et n'est pas sur la page de dépôt
        if (!userProfile?.hasInitialDeposit && !location.pathname.startsWith('/initial-deposit')) {
          // Stocker l'URL de redirection pour y revenir après le dépôt
          const redirectTo = location.pathname !== '/logout' ? location.pathname + location.search : '/';
          
          // Rediriger vers la page de dépôt initial
          navigate('/initial-deposit', { 
            state: { from: redirectTo },
            replace: true 
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du dépôt initial:', error);
        toast.error('Une erreur est survenue lors de la vérification de votre compte');
      } finally {
        setIsChecking(false);
      }
    };

    checkInitialDeposit();
  }, [isAuthenticated, navigate, location]);

  // Afficher un indicateur de chargement pendant la vérification
  if (isAuthLoading || isChecking) {
    return <LoadingSpinner fullPage />;
  }

  // Si l'utilisateur est sur la page de dépôt initial ou a effectué un dépôt, afficher les enfants
  return <>{children}</>;
};

export default InitialDepositGuard;
