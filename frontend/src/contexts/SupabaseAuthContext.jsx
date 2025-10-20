import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '../utils/supabaseClient';
// Suppression de l'import de useNavigate car il sera passé en tant que prop

// Configuration
const TOKEN_REFRESH_BUFFER = 60 * 5; // 5 minutes avant expiration
const VISIBILITY_CHECK_INTERVAL = 60000; // 1 minute

const AuthContext = createContext({
  user: null,
  loading: true,
  isInitialized: false,
  isAuthenticated: false,
  login: async () => ({}),
  register: async () => ({}),
  logout: async () => ({}),
  refreshUser: async () => ({}),
  updateProfile: async () => ({})
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Référence pour stocker la fonction de navigation
  const navigateRef = useRef(null);
  
  // Fonction pour définir la fonction de navigation
  const setNavigate = useCallback((navigateFunction) => {
    navigateRef.current = navigateFunction;
  }, []);
  
  // Fonction pour effectuer une redirection
  const redirectTo = useCallback((path) => {
    console.log('Redirection demandée vers:', path);
    if (navigateRef.current) {
      navigateRef.current(path);
    } else {
      console.warn('La fonction de navigation n\'est pas encore disponible');
      // Au lieu d'utiliser window.location.href, on attend que la navigation soit disponible
      // ou on laisse le composant gérer la redirection via son propre effet
      console.log('La navigation sera gérée par le composant parent');
    }
  }, []);
  
  // Références pour les timers et abonnements
  const refreshInterval = useRef(null);
  const authSubscription = useRef(null);
  
  // Vérifier la connectivité réseau
  const checkNetworkConnectivity = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(import.meta.env.VITE_SUPABASE_URL + '/rest/v1/', {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn('[AUTH] Erreur de connexion au serveur:', error.message);
      return false;
    }
  }, []);

  // Gérer la session utilisateur
  const handleSession = useCallback(async (session) => {
    if (!session?.user) {
      console.log('[AUTH] Aucune session utilisateur active');
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      console.log('[AUTH] Session utilisateur détectée:', session.user.email);
      
      // Mettre à jour l'état utilisateur
      const userWithProfile = {
        ...session.user,
        firstName: session.user.user_metadata?.first_name || '',
        lastName: session.user.user_metadata?.last_name || '',
        fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || ''
      };
      
      setUser(userWithProfile);
      
      // Stocker le token dans localStorage pour une utilisation avec l'API
      if (session.access_token) {
        localStorage.setItem('token', session.access_token);
      }
      
      return userWithProfile;
    } catch (error) {
      console.error('[AUTH] Erreur lors du traitement de la session:', error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initialiser l'authentification
  const initAuth = useCallback(async () => {
    try {
      console.log('[AUTH] Initialisation de l\'authentification...');
      setLoading(true);

      // Vérifier si l'utilisateur est déjà connecté
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('[AUTH] Erreur lors de la récupération de la session:', error);
        throw error;
      }
      
      if (session) {
        console.log('[AUTH] Session trouvée, traitement...');
        await handleSession(session);
      } else {
        console.log('[AUTH] Aucune session active');
        setUser(null);
      }
    } catch (error) {
      console.error('[AUTH] Erreur lors de l\'initialisation de l\'authentification:', error);
      setUser(null);
    } finally {
      console.log('[AUTH] Initialisation terminée');
      setLoading(false);
      setIsInitialized(true);
    }
  }, [handleSession]);
  
  // Configurer les écouteurs d'authentification
  useEffect(() => {
    console.log('[AUTH] Configuration des écouteurs d\'authentification');
    
    // Initialiser l'authentification
    initAuth();
    
    // S'abonner aux changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AUTH] Événement d\'authentification:', event);
      
      switch (event) {
        case 'SIGNED_IN':
          console.log('[AUTH] Utilisateur connecté:', session?.user?.email);
          await handleSession(session);
          // Ne pas rediriger ici pour éviter les boucles
          // La redirection sera gérée par le composant de connexion
          break;
          
        case 'SIGNED_OUT':
          console.log('[AUTH] Utilisateur déconnecté');
          setUser(null);
          // Ne pas rediriger automatiquement pour éviter les boucles
          break;
          
        case 'TOKEN_REFRESHED':
          console.log('[AUTH] Token rafraîchi avec succès');
          break;
          
        case 'USER_UPDATED':
          console.log('[AUTH] Utilisateur mis à jour:', session?.user);
          setUser(prev => ({
            ...prev,
            ...(session?.user || {})
          }));
          break;
          
        default:
          console.log(`[AUTH] Événement non géré: ${event}`);
      }
    });
    
    authSubscription.current = subscription;
    
    // Nettoyer l'abonnement lors du démontage
    return () => {
      console.log('[AUTH] Nettoyage des écouteurs d\'authentification');
      if (authSubscription.current) {
        authSubscription.current.unsubscribe?.();
      }
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [initAuth, handleSession]);
  
  // Fonction d'inscription
  const register = useCallback(async (email, password, userData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            full_name: `${userData.firstName} ${userData.lastName}`
          },
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (error) throw error;
      
      if (data?.user) {
        // L'utilisateur est créé mais doit vérifier son email
        return { 
          success: true, 
          message: 'Un email de confirmation a été envoyé à votre adresse email.'
        };
      }
      
      return { success: false, error: 'Erreur inconnue lors de l\'inscription' };
    } catch (error) {
      console.error('[AUTH] Erreur d\'inscription:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction de connexion
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        await handleSession(data.session);
        return { success: true };
      }
      
      return { success: false, error: 'Erreur inconnue lors de la connexion' };
    } catch (error) {
      console.error('[AUTH] Erreur de connexion:', error);
      setUser(null);
      localStorage.removeItem('token');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleSession]);
  
  // Fonction de déconnexion
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      localStorage.removeItem('token');
      redirectTo('/login');
      return { success: true };
    } catch (error) {
      console.error('[AUTH] Erreur lors de la déconnexion:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [redirectTo]);
  
  // Fonction pour rafraîchir l'utilisateur
  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (currentUser) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await handleSession(session);
        }
        return { success: true, user: currentUser };
      }
      
      return { success: false, error: 'Aucun utilisateur connecté' };
    } catch (error) {
      console.error('[AUTH] Erreur lors du rafraîchissement de l\'utilisateur:', error);
      setUser(null);
      localStorage.removeItem('token');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleSession]);
  
  // Fonction pour mettre à jour le profil
  const updateProfile = useCallback(async (updates) => {
    try {
      if (!user) {
        throw new Error('Aucun utilisateur connecté');
      }
      
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });
      
      if (error) throw error;
      
      if (data?.user) {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          await handleSession(sessionData.session);
        }
        return { success: true, user: data.user };
      }
      
      return { success: false, error: 'Erreur inconnue lors de la mise à jour du profil' };
    } catch (error) {
      console.error('[AUTH] Erreur lors de la mise à jour du profil:', error);
      return { success: false, error: error.message };
    }
  }, [user, handleSession]);
  
  // Valeur du contexte
  const value = useMemo(() => ({
    user,
    loading,
    isInitialized,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    setNavigate, // Exposer setNavigate pour les composants enfants
  }), [user, loading, isInitialized, login, register, logout, refreshUser, updateProfile, setNavigate]);
  
  // Effet pour gérer le rafraîchissement du token
  useEffect(() => {
    if (!user) return;
    
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const now = Math.floor(Date.now() / 1000);
          const timeUntilExpiry = payload.exp - now;
          
          // Si le token expire dans moins de 5 minutes, on le rafraîchit
          if (timeUntilExpiry < TOKEN_REFRESH_BUFFER) {
            console.log('[AUTH] Rafraîchissement du token en cours...');
            supabase.auth.refreshSession();
          }
        } catch (error) {
          console.error('[AUTH] Erreur lors de la vérification du token:', error);
        }
      }
    };
    
    // Vérifier toutes les minutes
    refreshInterval.current = setInterval(checkTokenExpiration, VISIBILITY_CHECK_INTERVAL);
    
    // Vérifier la visibilité de la page pour rafraîchir la session si nécessaire
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        console.log('[AUTH] Page visible, vérification de la session...');
        await refreshUser();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, refreshUser]);
  
  // Rendu du fournisseur de contexte
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

export default AuthContext;