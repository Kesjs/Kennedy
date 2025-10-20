import { Fragment, useState, useCallback, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Transition, Disclosure } from '@headlessui/react';
import { 
  HomeIcon,
  UserGroupIcon, 
  CogIcon,
  CurrencyDollarIcon,
  ArrowRightOnRectangleIcon,
  WalletIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/SupabaseAuthContext';

const navigation = [
  { 
    name: 'Tableau de bord', 
    href: '/dashboard', 
    icon: HomeIcon,
    tooltip: 'Tableau de bord'
  },
  { 
    name: 'Portefeuille', 
    href: '/portfolio', 
    icon: WalletIcon,
    tooltip: 'Votre portefeuille d\'investissement'
  },
  { 
    name: 'Investissements', 
    href: '/investments', 
    icon: CurrencyDollarIcon,
    tooltip: 'Gestion des investissements'
  },
  { 
    name: 'Équipe', 
    href: '/team', 
    icon: UserGroupIcon,
    tooltip: 'Gestion de l\'équipe',
    adminOnly: true
  },
  { 
    name: 'Paramètres', 
    href: '/settings', 
    icon: CogIcon,
    tooltip: 'Paramètres du compte'
  },
  { 
    name: 'Aide', 
    href: '/help', 
    icon: QuestionMarkCircleIcon,
    tooltip: 'Centre d\'aide et support'
  }
];

const Sidebar = ({ isMobileOpen, onMobileToggle, isCollapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const isMobile = window.innerWidth < 1024;
  const sidebarRef = useRef(null);

  // Gérer l'ouverture/fermeture des sous-menus
  const toggleSubMenu = useCallback((index) => {
    setActiveMenu(prev => prev === index ? null : index);
  }, []);

  // Fermer le menu mobile lors du clic sur un lien
  const handleNavClick = useCallback(() => {
    if (isMobile) {
      onMobileToggle();
    }
  }, [isMobile, onMobileToggle]);

  // Indicateur visuel pour les sous-menus
  const renderChevron = (isOpen) => {
    return (
      <div className="ml-auto flex flex-col space-y-1">
        <span className="block h-0.5 w-3 bg-current rounded-full"></span>
        <span className="block h-0.5 w-3 bg-current rounded-full"></span>
      </div>
    );
  };

  // Fermer le menu mobile lors de la navigation
  useEffect(() => {
    if (isMobile && isMobileOpen) {
      onMobileToggle();
    }
  }, [location.pathname, isMobile, isMobileOpen, onMobileToggle]);
  
  // Empêcher la propagation des clics dans la sidebar
  const handleSidebarClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="flex h-full">
      {/* Bouton de réduction/extension du menu */}
      <button
        onClick={onToggleCollapse}
        className="fixed left-0 top-1/2 z-50 -translate-y-1/2 transform rounded-r-lg bg-white dark:bg-gray-800 p-2 shadow-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-l-0 border-gray-200 dark:border-gray-700"
        style={{
          left: isCollapsed ? '5rem' : '16rem',
          transition: 'left 300ms ease-in-out',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          marginLeft: '1px' // Assure le chevauchement de la bordure
        }}
        aria-label={isCollapsed ? "Ouvrir le menu" : "Fermer le menu"}
        title={isCollapsed ? "Ouvrir le menu" : "Fermer le menu"}
      >
        <div className="flex flex-col items-center justify-center p-1">
          <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </div>
      </button>

      {/* Barre latérale principale */}
      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 h-screen flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out ${
          isMobile ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        } ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } lg:translate-x-0`}
        style={{
          width: isMobile ? '16rem' : isCollapsed ? '5rem' : '16rem',
          height: '100vh',
          overflowY: 'auto',
          position: 'fixed',
          transition: 'all 300ms ease-in-out',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)'
        }}
        onClick={handleSidebarClick}
      >
        {/* Logo et Titre */}
        <div className={`flex items-center h-16 ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}>
          <div className="flex items-center">
            <img 
              src="https://i.pinimg.com/originals/86/9f/b0/869fb06135a2dc55e520ce34cfe6c385.jpg"
              alt="Logo"
              className={`object-contain ${isCollapsed ? 'h-10 w-10' : 'h-8 w-8'}`}
            />
            {!isCollapsed && (
              <span className="ml-2 text-lg font-bold text-purple-400 whitespace-nowrap">
                Gazoduc Invest
              </span>
            )}
          </div>
        </div>
        
        {/* Bouton de fermeture mobile */}
        <div className="flex justify-between items-center px-4 py-3 lg:hidden border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMobileToggle();
            }}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Fermer le menu"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse();
              }}
              className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 flex items-center justify-center"
              aria-label={isCollapsed ? "Déplier le menu" : "Replier le menu"}
              title={isCollapsed ? "Déplier le menu" : "Replier le menu"}
            >
              <div className="flex flex-col space-y-1.5">
                <span className="block h-0.5 w-5 bg-current rounded-full"></span>
                <span className="block h-0.5 w-5 bg-current rounded-full"></span>
                <span className="block h-0.5 w-5 bg-current rounded-full"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Contenu du menu */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden py-2">
          <nav className="px-3 space-y-1">
            {navigation.map((item, index) => (
              <div key={item.name}>
                {!item.children ? (
                  <NavLink
                    to={item.href}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      } ${isCollapsed ? 'justify-center' : ''}`
                    }
                    title={item.tooltip}
                  >
                    <item.icon
                      className={`flex-shrink-0 h-5 w-5 ${
                        isCollapsed ? 'mx-auto' : 'mr-3'
                      }`}
                      aria-hidden="true"
                    />
                    {!isCollapsed && item.name}
                    {item.badge && (
                      <span className="ml-auto inline-block py-0.5 px-2 text-xs rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ) : (
                  <Disclosure defaultOpen={location.pathname.startsWith(item.href)} as="div" className="w-full">
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={`group w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                            location.pathname.startsWith(item.href)
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                          } ${isCollapsed ? 'justify-center' : ''}`}
                          onClick={() => toggleSubMenu(index)}
                        >
                          <item.icon
                            className={`flex-shrink-0 h-5 w-5 ${
                              isCollapsed ? 'mx-auto' : 'mr-3'
                            }`}
                            aria-hidden="true"
                          />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 text-left">{item.name}</span>
                              {renderChevron(activeMenu === index)}
                            </>
                          )}
                        </Disclosure.Button>
                        <Disclosure.Panel className={`mt-1 space-y-1 ${isCollapsed ? 'hidden' : ''}`}>
                          <Transition
                            show={!isCollapsed}
                            enter="transition-all duration-200 ease-out"
                            enterFrom="opacity-0 max-h-0"
                            enterTo="opacity-100 max-h-96"
                            leave="transition-all duration-200 ease-out"
                            leaveFrom="opacity-100 max-h-96"
                            leaveTo="opacity-0 max-h-0"
                          >
                            <div className="pl-8 space-y-1">
                              {item.children.map((subItem) => (
                                <NavLink
                                  key={subItem.name}
                                  to={subItem.href}
                                  onClick={handleNavClick}
                                  className={({ isActive }) =>
                                    `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                      isActive
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                    }`
                                  }
                                >
                                  {subItem.name}
                                  {subItem.badge && (
                                    <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                                      {subItem.badge}
                                    </span>
                                  )}
                                </NavLink>
                              ))}
                            </div>
                          </Transition>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Pied de page du menu */}
        <div className={`p-3 border-t border-gray-200 dark:border-gray-700 ${isCollapsed ? 'text-center' : ''}`}>
          <div className="flex items-center">
            <div
              className={`flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium`}
            >
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            {!isCollapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className={`mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 ${
              isCollapsed ? 'p-2' : ''
            }`}
          >
            {!isCollapsed ? (
              'Déconnexion'
            ) : (
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
