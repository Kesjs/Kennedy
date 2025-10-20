import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // URL directe vers le backend
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('[API] Ajout du token à la requête:', config.url);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('[API] Aucun token trouvé pour la requête:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('[API] Erreur dans l\'intercepteur de requête:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle token expiration
    if (response?.status === 401) {
      console.log('[API] Erreur 401 - Non authentifié');
      // Ne pas afficher de toast ici pour éviter les doublons
      // La redirection sera gérée par le composant
      return Promise.reject({ ...error, isAuthError: true });
    }
    
    // Handle server errors
    if (response?.data?.message) {
      toast.error(response.data.message);
    } else if (error.message === 'Network Error') {
      toast.error('Erreur de connexion au serveur');
    } else {
      toast.error('Une erreur est survenue');
    }
    
    return Promise.reject(error);
  }
);

export default api;
