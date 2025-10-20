import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './GlassNavbar.css';

// Composant pour les liens de navigation desktop
const NavLink = ({ to, onClick, text, className = '', isSection = false }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.hash === `#${to}`;
  
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      if (isSection) {
        // Si c'est une section, on utilise la fonction de défilement personnalisée
        onClick(to);
      } else if (onClick) {
        onClick();
      }
    }
  };

  return (
    <Link
      to={isSection ? `#${to}` : to}
      onClick={handleClick}
      className={`text-sm font-medium transition-colors duration-200 ${
        isActive 
          ? 'text-white' 
          : 'text-gray-300 hover:text-white'
      } ${className}`}
    >
      {text}
    </Link>
  );
};

// Composant pour les liens de navigation mobile
const MobileNavLink = ({ to, onClick, text, className = '', isSection = false }) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      if (isSection) {
        onClick(to);
      } else if (onClick) {
        onClick();
      }
    }
  };

  return (
    <Link
      to={isSection ? `#${to}` : to}
      onClick={handleClick}
      className={`block w-full py-2 px-3 rounded-lg hover:bg-white/5 transition-colors duration-200 text-gray-200 hover:text-white ${className}`}
    >
      {text}
    </Link>
  );
};

// Fonction utilitaire pour obtenir le nom d'affichage de l'utilisateur
const getUserDisplayName = (user) => {
  if (!user) return 'Mon Compte';
  
  // Essayer dans l'ordre : fullName, firstName + lastName, user_metadata, email
  return (
    user.fullName ||
    (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null) ||
    (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null) ||
    user.user_metadata?.full_name ||
    (user.user_metadata?.first_name && user.user_metadata?.last_name 
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}` 
      : null) ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Mon Compte'
  );
};

const GlassNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Débogage des données utilisateur
  useEffect(() => {
    if (user) {
      console.log('Données utilisateur:', {
        email: user.email,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        user_metadata: user.user_metadata,
        raw: user
      });
      
      // Afficher le nom calculé
      console.log('Nom d\'affichage calculé:', getUserDisplayName(user));
    }
  }, [user]);
  
  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  // Gestion du défilement pour l'effet de rétrécissement
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fonction pour faire défiler vers une section
  const scrollTo = (id) => {
    if (id.startsWith('#')) {
      id = id.substring(1);
    }
    
    if (window.location.pathname !== '/') {
      // Si on n'est pas sur la page d'accueil, on navigue vers la page d'accueil avec le hash
      navigate(`/#${id}`, { replace: true });
      
      // On attend que la page soit chargée avant de faire défiler
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -100;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      // Si on est sur la page d'accueil, on fait défiler vers la section
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -100;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({ top: y, behavior: 'smooth' });
        
        // Met à jour l'URL sans recharger la page
        window.history.pushState({}, '', `#${id}`);
      }
    }
  };

  // Composant d'icône de chargement animée
  const LoadingSpinner = () => (
    <motion.div
      className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  // Composant de succès avec animation
  const SuccessCheckmark = () => (
    <motion.div
      className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <motion.svg
        className="h-4 w-4 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.polyline 
          points="20 6 9 17 4 12"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
      </motion.svg>
    </motion.div>
  );

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      // Afficher une notification de déconnexion en cours
      toast.loading('Déconnexion en cours...', {
        id: 'logout-toast',
        duration: 2000
      });
      
      const result = await logout();
      
      if (result && result.success) {
        // Mettre à jour la notification pour indiquer la réussite
        toast.success('Déconnexion réussie', {
          id: 'logout-toast',
          duration: 1500
        });
        
        // Naviguer vers la page d'accueil après un court délai
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
        
      } else {
        throw new Error(result?.error || 'Échec de la déconnexion');
      }
    } catch (error) {
      console.error('Logout error:', error);
      
      // Afficher un message d'erreur
      toast.error(error.message || 'Échec de la déconnexion', {
        id: 'logout-toast',
        duration: 3000
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return ( 
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`relative rounded-2xl border transition-all duration-300 ${
            isScrolled 
              ? 'bg-black/90 backdrop-blur-lg border-white/20 shadow-xl' 
              : 'bg-black/80 backdrop-blur-md border-white/10 shadow-lg'
          }`}
          style={{
            WebkitBackdropFilter: 'blur(12px)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 no-underline hover:no-underline"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative h-16 w-16">
                <img 
                  src="https://i.pinimg.com/originals/86/9f/b0/869fb06135a2dc55e520ce34cfe6c385.jpg" 
                  alt="Logo Gazoduc Invest" 
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-lg font-bold text-primary-300 underline decoration-primary-300 decoration-2">
                Gazoduc Invest.
              </span>
            </Link>

            {/* Navigation desktop */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink 
                to="#features" 
                text="Fonctionnalités" 
                isSection={true}
                onClick={() => scrollTo('features')}
                className="px-3 py-2 hover:text-primary-200 transition-colors duration-200"
              />
              
              <NavLink 
                to="#pricing" 
                text="Pricing" 
                isSection={true}
                onClick={() => scrollTo('pricing')}
                className="px-3 py-2 hover:text-primary-200 transition-colors duration-200"
              />
              
              <NavLink 
                to="#about" 
                text="About" 
                isSection={true}
                onClick={() => scrollTo('about')}
                className="px-3 py-2 hover:text-primary-200 transition-colors duration-200"
              />
              
              <NavLink 
                to="/invest" 
                text="Investir" 
                className="ml-2 px-5 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors duration-200 font-medium"
              />
            </div>

            {/* Boutons d'authentification et thème */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative group">
                  <button 
                    className="flex items-center space-x-2 focus:outline-none bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200"
                    aria-label="Menu utilisateur"
                  >
                    <User className="w-5 h-5 text-white flex-shrink-0" />
                    <span className="text-sm font-medium text-white truncate max-w-[120px]">
                      {getUserDisplayName(user)}
                    </span>
                    <ChevronDown className="w-4 h-4 text-white/70 transition-colors flex-shrink-0" />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-gray-800/95 backdrop-blur-lg border border-white/10 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform -translate-y-1 group-hover:translate-y-0">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-medium text-white truncate">{getUserDisplayName(user)}</p>
                      <p className="text-xs text-gray-400 mt-1">{user.email}</p>
                      <p className="text-xs text-primary-300 mt-1">
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </p>
                    </div>
                    
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-3 text-sm text-gray-200 hover:bg-white/5 transition-colors group/item"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-3 text-primary-400 group-hover/item:text-primary-300" />
                      <span>Tableau de bord</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className={`w-full flex items-center px-4 py-3 text-sm ${isLoggingOut ? 'text-gray-500' : 'text-red-400 hover:bg-red-500/10'} transition-colors group/item`}
                    >
                      <LogOut className={`w-4 h-4 mr-3 ${isLoggingOut ? '' : 'group-hover/item:animate-pulse'}`} />
                      <span>{isLoggingOut ? 'Déconnexion en cours...' : 'Déconnexion'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-white hover:bg-violet-500/10 transition-all duration-300 rounded-lg border border-transparent hover:border-violet-400/30"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white hover:text-white bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 rounded-lg transition-all duration-300 shadow-lg hover:shadow-violet-500/30 relative overflow-hidden group"
                  >
                    <span className="relative z-10">S'inscrire</span>
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Link>
                </div>
              )}
            </div>

            {/* Bouton menu mobile */}
            <button 
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              aria-label="Menu"
              aria-expanded={isMobileOpen}
            >
              <div className="space-y-1.5">
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isMobileOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>

          {/* Menu mobile */}
          <div 
            className={`md:hidden transition-all duration-300 overflow-hidden ${
              isMobileOpen ? 'max-h-96 border-t border-white/10' : 'max-h-0'
            }`}
          >
            <div className="px-4 py-3 space-y-2">
              <MobileNavLink 
                onClick={scrollTo} 
                text="Fonctionnalités" 
                to="features"
                isSection={true}
              />
              <MobileNavLink 
                onClick={scrollTo} 
                text="Comment ça marche" 
                to="how-it-works"
                isSection={true}
              />
              <MobileNavLink 
                to="/invest" 
                text="Investir" 
              />
              <MobileNavLink 
                to="/contact" 
                text="Contact" 
              />
              
              {user ? (
                <div className="border-t border-white/10 pt-3 mt-2">
                  <div className="px-3 py-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 01-.788 0l-7 3a1 1 0 010 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 01.287.02l4.657.98a1 1 0 01.764.727l.5 2.5a1 1 0 101.28 1.537l1.536-1.28a1 1 0 01.78-.172l2.5.5a1 1 0 01.547 1.65l-1.28 1.537a1 1 0 101.537 1.28l1.28-1.537a1 1 0 01.172-.78l.5-2.5a1 1 0 10-1.537-1.28l-1.28 1.537a1 1 0 01-.78.172l-2.5-.5a1 1 0 01-.547-1.65l1.28-1.537a1 1 0 10-1.537-1.28l-1.28 1.537a1 1 0 01-.78.172l-4.657-.98a1 1 0 01-.287-.02l-1.94-.832-1.32.565a1 1 0 01-.788-1.838l7-3a1 1 0 01.788 0z" clipRule="evenodd" />
                      </svg>
                      Tableau de bord
                    </Link>
                  </div>
                  <div className="px-3 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 text-red-400 hover:bg-red-400/10 px-3 py-2 rounded-lg transition-colors text-left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-3 mt-2 border-t border-white/10 flex gap-3">
                  <Link 
                    to="/login" 
                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-gray-200 hover:text-white transition-all duration-300 bg-white/5 rounded-lg hover:bg-violet-500/10 border border-transparent hover:border-violet-400/30"
                  >
                    Connexion
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:text-white rounded-lg hover:from-violet-700 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-violet-500/30 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Commencer</span>
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GlassNavbar;
