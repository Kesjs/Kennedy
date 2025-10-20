import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import Sidebar from './SidebarNew';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // État pour gérer le repli/dépliage du sidebar
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Récupérer l'état du localStorage si disponible, sinon false par défaut
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved === 'true';
    }
    return false;
  });
  
  // Sauvegarder l'état du sidebar dans le localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed);
  }, [isCollapsed]);
  
  // Fermer le menu mobile lors du redimensionnement vers desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      } else {
        // Sur mobile, le sidebar est toujours replié par défaut
        setIsCollapsed(true);
      }
    };
    
    // Vérifier la taille de l'écran au chargement
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
    // Ne pas inclure isMobileOpen dans les dépendances pour éviter les boucles infinies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Gestion de l'ouverture/fermeture du menu mobile
  const toggleMobileMenu = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsMobileOpen(prev => !prev);
  }, []);
  
  // Gestion du repli/dépliage du menu
  const toggleCollapse = useCallback(() => {
    // Sur mobile, on ne permet pas le repli
    if (window.innerWidth < 1024) {
      return;
    }
    setIsCollapsed(prev => !prev);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Vérifier si c'est la page d'accueil
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-200">
      <Header 
        onMenuToggle={toggleMobileMenu} 
        isMenuOpen={isMobileOpen} 
        isCollapsed={isCollapsed} 
      />
      
      {/* Overlay pour mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-20 transition-opacity duration-300"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
      
      <div className="flex flex-1 overflow-hidden pt-16 relative">
        <Sidebar 
          isMobileOpen={isMobileOpen} 
          onMobileToggle={toggleMobileMenu} 
          isCollapsed={isCollapsed} 
          onToggleCollapse={toggleCollapse}
        />
        <main 
          className={`flex-1 flex flex-col overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out ${
            isCollapsed ? 'md:ml-20' : 'md:ml-64'
          }`}
          style={{
            minHeight: 'calc(100vh - 4rem)', // Hauteur de l'écran moins la hauteur du header
            transition: 'margin-left 300ms ease-in-out'
          }}
        >
          <div className="flex-1">
            <div className="py-6">
              <div className="mx-auto px-4 sm:px-6 md:px-8">
                {children || <Outlet />}
              </div>
            </div>
          </div>
          <div className="mt-auto">
            {!isHomePage && <Footer />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
