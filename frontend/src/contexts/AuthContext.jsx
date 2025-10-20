import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Set auth token in axios headers
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [token]);

  // Fetch user data
  const fetchUser = async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      setUser(data.user);
      
      // Si l'utilisateur n'est pas vérifié, on le redirige vers la page de vérification
      if (!data.user?.email_verified) {
        navigate('/verify-email', { 
          state: { 
            message: 'Veuillez vérifier votre adresse email pour continuer.',
            email: data.user?.email
          } 
        });
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      // Ne pas déconnecter automatiquement en cas d'erreur pour éviter les boucles
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      
      // If 2FA is required, return the 2FA status
      if (data.twoFactorRequired) {
        return { requires2FA: true, tempToken: data.tempToken };
      }
      
      // Mettre à jour l'utilisateur avec les données du serveur
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      
      // Toujours rediriger vers le tableau de bord après une connexion réussie
      // La vérification de l'email est déjà gérée par le serveur
      navigate('/dashboard');
      toast.success('Connexion réussie !');
      
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      
      // Gérer spécifiquement l'erreur de vérification d'email
      if (err.response?.data?.code === 'email_not_verified') {
        // Si l'utilisateur existe mais que l'email n'est pas vérifié
        // On le redirige vers la page de vérification d'email
        navigate('/verify-email', { 
          state: { 
            message: err.response.data.message,
            email: err.response.data.email
          } 
        });
        return { success: false, requiresVerification: true };
      }
      
      const errorMessage = err.response?.data?.message || 'Erreur de connexion';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Verify 2FA
  const verify2FA = async (code, tempToken) => {
    try {
      const { data } = await api.post('/api/auth/verify-2fa', { code, tempToken });
      
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      
      navigate('/dashboard');
      toast.success('Connexion réussie avec 2FA !');
      
      return { success: true };
    } catch (err) {
      console.error('2FA verification error:', err);
      const errorMessage = err.response?.data?.message || 'Code 2FA invalide';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const { data } = await api.post('/api/auth/register', userData);
      
      // Si l'inscription est réussie mais que l'email n'est pas vérifié
      if (data.user) {
        navigate('/verify-email', { 
          state: { 
            message: 'Un email de vérification a été envoyé à votre adresse email.',
            email: data.user.email
          } 
        });
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || "Erreur lors de l'inscription";
      toast.error(errorMessage);
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      navigate('/login');
      toast.success('Déconnexion réussie');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(prev => ({
      ...prev,
      ...userData
    }));
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Check if email is verified
  const isEmailVerified = () => {
    return user?.email_verified || user?.isVerified;
  };

  // Resend verification email
  const resendVerificationEmail = async (email) => {
    try {
      await api.post('/api/auth/resend-verification', { email });
      toast.success('Email de vérification envoyé avec succès');
      return true;
    } catch (err) {
      console.error('Resend verification error:', err);
      const errorMessage = err.response?.data?.message || "Erreur lors de l'envoi de l'email de vérification";
      toast.error(errorMessage);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    token,
    login,
    verify2FA,
    register,
    logout,
    updateUser,
    isAuthenticated,
    isAdmin,
    isEmailVerified,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
