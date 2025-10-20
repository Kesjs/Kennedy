import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/SupabaseAuthContext';

/**
 * Composant wrapper pour initialiser la navigation dans le contexte d'authentification
 * Doit être utilisé à l'intérieur d'un composant Router
 */
const AuthProviderWrapper = ({ children }) => {
  const { setNavigate } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialiser la fonction de navigation dans le contexte d'authentification
    if (setNavigate) {
      setNavigate(navigate);
    }
  }, [navigate, setNavigate]);

  return children;
};

export default AuthProviderWrapper;
