import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../utils/supabaseClient';

// Configuration
const TOKEN_REFRESH_BUFFER = 60 * 5; // 5 minutes avant expiration
const VISIBILITY_CHECK_INTERVAL = 60000; // 1 minute

// Fonction utilitaire pour générer un code de parrainage
const generateReferralCode = (email) => {
  return email ? `${email.split('@')[0]}_${Math.random().toString(36).substr(2, 6)}` : '';
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  console.log('Initialisation du AuthProvider');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigateRef = useRef(null);
  const refreshTimer = useRef(null);
  const visibilityCheckTimer = useRef(null);
  
  // Fonction pour définir la fonction de navigation
  const setNavigate = (navigateFunction) => {
    navigateRef.current = navigateFunction;
  };

  // Fonction utilitaire pour la navigation sécurisée
  const safeNavigate = useCallback((to, options) => {
    if (navigateRef.current) {
      navigateRef.current(to, options);
    } else {
      console.warn('Navigation non disponible. Le routeur est peut-être en cours de chargement.');
    }
  }, []);

  // Fonction pour vérifier si l'utilisateur est authentifié
  const isAuthenticated = useCallback(() => {
    return !!user && !!user.id;
  }, [user]);

  // Fonction pour vérifier les rôles
  const hasRole = useCallback((requiredRole) => {
    if (!user) return false;
    if (!requiredRole) return true;
    return user.role === requiredRole;
  }, [user]);

  // Fonction pour vérifier si l'utilisateur est admin
  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  // Fonction pour charger ou créer un profil utilisateur
  const loadOrCreateProfile = useCallback(async (userData) => {
    if (!userData?.id) {
      console.error('Aucun ID utilisateur fourni');
      return null;
    }

    try {
      // Vérifier si le profil existe
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.id)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        return null;
      }

      // Si le profil existe, le retourner avec des valeurs par défaut pour les champs manquants
      if (profile) {
        return {
          ...userData,
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: profile.phone || '',
          role: profile.role || 'user',
          is_verified: profile.is_verified || false,
          created_at: profile.created_at || new Date().toISOString(),
          ...profile
        };
      }

      // Créer un nouveau profil avec des valeurs par défaut
      const defaultProfile = {
        id: userData.id,
        email: userData.email || '',
        first_name: userData.user_metadata?.given_name || userData.user_metadata?.name?.split(' ')[0] || '',
        last_name: userData.user_metadata?.family_name || userData.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
        phone: userData.phone || userData.user_metadata?.phone || '',
        role: 'user',
        is_verified: !!userData.email_confirmed_at,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        kyc_status: 'not_started',
        kyc_data: {},
        address: {}
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert(defaultProfile)
        .select()
        .single();

      if (createError) {
        console.error('Erreur lors de la création du profil:', createError);
        return {
          ...userData,
          ...defaultProfile,
          is_verified: !!userData.email_confirmed_at
        };
      }

      return {
        ...userData,
        ...defaultProfile,
        ...createdProfile,
        is_verified: !!userData.email_confirmed_at
      };
    } catch (error) {
      console.error('Erreur dans loadOrCreateProfile:', error);
      return {
        ...userData,
        first_name: userData.user_metadata?.given_name || '',
        last_name: userData.user_metadata?.family_name || '',
        role: 'user',
        is_verified: !!userData.email_confirmed_at
      };
    }
  }, []);

  // Fonction pour charger l'utilisateur
  const loadUser = useCallback(async (session) => {
    try {
      setLoading(true);
      
      if (!session?.user) {
        setUser(null);
        return null;
      }

      const userData = await loadOrCreateProfile(session.user);
      
      if (userData) {
        const userWithRole = {
          ...userData,
          role: userData.role || 'user',
          is_verified: userData.is_verified || !!userData.email_confirmed_at,
        };
        setUser(userWithRole);
        return userWithRole;
      }
      
      setUser(null);
      return null;
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadOrCreateProfile]);

  // Fonction pour planifier le rafraîchissement du token
  const scheduleTokenRefresh = useCallback((expiresIn) => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
    }

    const refreshTime = Math.max(0, (expiresIn - TOKEN_REFRESH_BUFFER) * 1000);
    
    if (refreshTime > 0) {
      refreshTimer.current = setTimeout(async () => {
        try {
          console.log('Tentative de rafraîchissement du token...');
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error) throw error;
          
          if (data.session) {
            console.log('Session rafraîchie avec succès');
            await loadUser(data.session);
            scheduleTokenRefresh(data.session.expires_in);
          }
        } catch (error) {
          console.error('Erreur lors du rafraîchissement de la session:', error);
          refreshTimer.current = setTimeout(() => {
            const { session } = supabase.auth.getSession();
            if (session) {
              scheduleTokenRefresh(session.expires_in);
            }
          }, 60000);
        }
      }, refreshTime);
    }
  }, [loadUser]);

  // Fonction de connexion
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setUser(null);
      
      if (!email || !password) {
        throw new Error('Veuillez fournir un email et un mot de passe');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('Login error:', error);
        
        // Gestion des erreurs spécifiques
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Identifiants invalides. Veuillez vérifier votre email et mot de passe.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Veuvez vérifier votre adresse email avant de vous connecter.');
        } else if (error.message.includes('rate limit')) {
          throw new Error('Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.');
        } else {
          throw new Error('Échec de la connexion. Veuillez réessayer plus tard.');
        }
      }

      if (!data?.user) throw new Error('Aucun utilisateur trouvé');

      const userData = await loadUser(data.session);
      safeNavigate('/dashboard');
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadUser, safeNavigate]);

  // Fonction de déconnexion
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      safeNavigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [safeNavigate]);

  // Fonction de mise à jour du profil
  const updateProfile = useCallback(async (updates) => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUser(prev => ({
        ...prev,
        ...data
      }));

      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fonction de réinitialisation du mot de passe
  const resetPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    let isMounted = true;
    let authSubscription = null;

    const checkSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (isMounted) setUser(null);
          return;
        }
        
        if (session && isMounted) {
          const userData = await loadUser(session);
          if (userData && session.expires_at) {
            const expiresIn = session.expires_at - Math.floor(Date.now() / 1000);
            if (expiresIn > 0) {
              scheduleTokenRefresh(expiresIn);
            }
          }
        } else if (isMounted) {
          setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Gestionnaire de visibilité de l'onglet
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        console.log('Onglet actif, vérification de la session...');
        await checkSession();
      }
    };

    // Vérification périodique de la session
    const setupVisibilityCheck = () => {
      if (visibilityCheckTimer.current) {
        clearInterval(visibilityCheckTimer.current);
      }
      visibilityCheckTimer.current = setInterval(() => {
        if (document.visibilityState === 'visible') {
          checkSession().catch(console.error);
        }
      }, VISIBILITY_CHECK_INTERVAL);
    };

    // Initialisation
    checkSession();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    setupVisibilityCheck();

    // Écouter les changements d'authentification
    const { data } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log('Changement d\'état d\'authentification:', event);
        
        try {
          switch (event) {
            case 'SIGNED_IN':
            case 'TOKEN_REFRESHED':
              if (session) {
                await loadUser(session);
                if (session.expires_at) {
                  const expiresIn = session.expires_at - Math.floor(Date.now() / 1000);
                  if (expiresIn > 0) {
                    scheduleTokenRefresh(expiresIn);
                  }
                }
              }
              break;
              
            case 'SIGNED_OUT':
              setUser(null);
              if (refreshTimer.current) {
                clearTimeout(refreshTimer.current);
                refreshTimer.current = null;
              }
              break;
              
            case 'USER_UPDATED':
              if (session) {
                await loadUser(session);
              }
              break;
              
            case 'PASSWORD_RECOVERY':
              // Gérer la réinitialisation du mot de passe si nécessaire
              break;
              
            default:
              console.log('Événement d\'authentification non géré:', event);
          }
        } catch (error) {
          console.error('Erreur lors du traitement de l\'événement', event, ':', error);
        }
      }
    );
    
    authSubscription = data;

    // Nettoyage
    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }
      
      if (visibilityCheckTimer.current) {
        clearInterval(visibilityCheckTimer.current);
      }
      
      if (authSubscription && typeof authSubscription.unsubscribe === 'function') {
        authSubscription.unsubscribe();
      }
    };
  }, [loadUser, scheduleTokenRefresh]);

  // Valeur du contexte
  const value = {
    user,
    loading,
    isAuthenticated,
    hasRole,
    isAdmin,
    login,
    logout,
    updateProfile,
    resetPassword,
    setNavigate,
    safeNavigate
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error(
      'useAuth doit être utilisé à l\'intérieur d\'un AuthProvider. ' +
      'Assurez-vous que votre application est enveloppée par <AuthProvider>.'
    );
  }
  
  return context;
};

export default AuthContext;
