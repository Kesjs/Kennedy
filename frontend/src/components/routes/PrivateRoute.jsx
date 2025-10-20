import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';

/**
 * Composant de route privée qui protège les routes nécessitant une authentification
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Les éléments enfants à afficher si l'utilisateur est authentifié
 * @param {boolean} [props.requireEmailVerification=false] - Si vrai, vérifie que l'email de l'utilisateur est vérifié
 * @param {string} [props.requiredRole] - Rôle requis pour accéder à la route (optionnel)
 * @param {React.ReactNode} [props.loadingComponent] - Composant de chargement personnalisé (optionnel)
 * @param {React.ReactNode} [props.unauthorizedComponent] - Composant à afficher en cas d'accès non autorisé (optionnel)
 * @returns {JSX.Element} Le composant de route protégé
 */
const PrivateRoute = ({
  children,
  requireEmailVerification = false,
  requiredRole,
  loadingComponent: CustomLoading = null,
  unauthorizedComponent: CustomUnauthorized = null,
  ...rest
}) => {
  console.log('[PRIVATE_ROUTE] Rendu du composant PrivateRoute');
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  
  console.log('[PRIVATE_ROUTE] État actuel:', {
    user: !!user,
    loading,
    isAuthenticated,
    isAdmin,
    initialLoad,
    requireEmailVerification,
    requiredRole,
    currentPath: location.pathname
  });

  // Gestion du chargement initial
  useEffect(() => {
    console.log('[PRIVATE_ROUTE] Effet de chargement initial démarré');
    let isMounted = true;
    
    const timer = setTimeout(() => {
      console.log('[PRIVATE_ROUTE] Timeout de chargement atteint');
      if (isMounted) {
        console.log('[PRIVATE_ROUTE] Mise à jour de initialLoad à false');
        setInitialLoad(false);
      } else {
        console.log('[PRIVATE_ROUTE] Composant déjà démonté, annulation de la mise à jour');
      }
    }, 5000); // Timeout de 5 secondes pour le chargement

    return () => {
      console.log('[PRIVATE_ROUTE] Nettoyage de l\'effet de chargement');
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Gestion des erreurs
  useEffect(() => {
    console.log('[PRIVATE_ROUTE] Vérification des erreurs d\'authentification', {
      loading,
      hasUser: !!user,
      isAuthenticated,
      initialLoad
    });

    if (!loading && !user && isAuthenticated === false && !initialLoad) {
      const error = new Error('Erreur de chargement des informations d\'authentification');
      console.error('[PRIVATE_ROUTE] Erreur d\'authentification:', error);
      setError(error);
    }
  }, [loading, user, isAuthenticated, initialLoad]);

  // Afficher le composant de chargement personnalisé ou par défaut
  const renderLoading = () => {
    if (CustomLoading) return CustomLoading;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <LoadingSpinner size="xl" className="mb-4" />
        <p className="text-gray-600 mt-4">Vérification de l'authentification...</p>
      </div>
    );
  };

  // Afficher le composant d'erreur personnalisé ou par défaut
  const renderError = (errorMessage) => {
    if (CustomUnauthorized) return CustomUnauthorized;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur d'authentification</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  };

  // Gestion des états de chargement
  if (loading || initialLoad) {
    console.log('[PRIVATE_ROUTE] Affichage du composant de chargement', { loading, initialLoad });
    return renderLoading();
  }

  // Gestion des erreurs
  if (error) {
    console.error('[PRIVATE_ROUTE] Erreur détectée:', error);
    return renderError(error.message);
  }

  // Redirection si non authentifié
  if (!user || !isAuthenticated) {
    console.log('[PRIVATE_ROUTE] Utilisateur non authentifié, redirection vers /login', {
      hasUser: !!user,
      isAuthenticated,
      currentPath: location.pathname,
      redirectTo: '/login'
    });
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Veuillez vous connecter pour accéder à cette page.',
        }}
        replace
      />
    );
  }

  // Vérification du rôle si spécifié
  if (requiredRole) {
    const hasRequiredRole = user.role === requiredRole || isAdmin;
    console.log('[PRIVATE_ROUTE] Vérification du rôle', {
      requiredRole,
      userRole: user.role,
      isAdmin,
      hasRequiredRole
    });
    
    if (!hasRequiredRole) {
      console.warn('[PRIVATE_ROUTE] Accès refusé: rôle insuffisant', {
        requiredRole,
        userRole: user.role
      });
      return renderError("Vous n'avez pas les autorisations nécessaires pour accéder à cette page.");
    }
  }

  // Vérification de l'email si nécessaire
  if (requireEmailVerification && !user.email_confirmed_at) {
    console.log('[PRIVATE_ROUTE] Vérification de l\'email', {
      requireEmailVerification,
      emailConfirmed: user.email_confirmed_at,
      currentPath: location.pathname
    });
    
    if (location.pathname !== '/verify-email') {
      console.log('[PRIVATE_ROUTE] Redirection vers /verify-email');
      return (
        <Navigate
          to="/verify-email"
          state={{
            from: location,
            message: 'Veuillez vérifier votre adresse email avant de continuer.',
          }}
          replace
        />
      );
    }
  }

  // Si tout est bon, afficher les enfants avec un ErrorBoundary
  return (
    <ErrorBoundary
      fallback={renderError('Une erreur est survenue dans cette page.')}
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  );
};

export default PrivateRoute;