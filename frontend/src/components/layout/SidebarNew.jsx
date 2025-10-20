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
  ChevronUpIcon,
  UserCircleIcon
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
    name: 'Investissements', 
    href: '/invest', 
    icon: CurrencyDollarIcon,
    children: [
      { name: 'Plans d\'investissement', href: '/invest' },
      { name: 'Nouvel investissement', href: '/invest/new' },
      { name: 'Mes investissements', href: '/invest/list' },
    ]
  },
  { 
    name: 'Portefeuille', 
    href: '/deposit', 
    icon: WalletIcon,
    children: [
      { name: 'Dépôt', href: '/deposit' },
      { name: 'Retrait', href: '/withdraw' },
      { name: 'Historique', href: '/transactions' },
    ]
  },
  { 
    name: 'Parrainage', 
    href: '/referral', 
    icon: UserGroupIcon,
    children: [
      { name: 'Vue d\'ensemble', href: '/referral' },
      { name: 'Mon lien', href: '/referral/link' },
      { name: 'Mes filleuls', href: '/referral/referrals' },
      { name: 'Commissions', href: '/referral/commissions' },
    ]
  },
  { 
    name: 'Documents', 
    href: '/documents', 
    icon: DocumentTextIcon,
    children: [
      { name: 'Tous les documents', href: '/documents' },
      { name: 'Factures', href: '/documents?type=invoice' },
      { name: 'Contrats', href: '/documents?type=contract' },
      { name: 'Rapports', href: '/documents?type=report' },
    ]
  },
  { 
    name: 'Support Client', 
    href: '/support', 
    icon: QuestionMarkCircleIcon,
    children: [
      { name: 'FAQ', href: '/support' },
      { name: 'Contactez-nous', href: '/support?tab=contact' },
      { name: 'Mes demandes', href: '/support?tab=tickets' },
      { name: 'Centre d\'aide', href: '/support?tab=help' },
    ]
  },
  { 
    name: 'Paramètres', 
    href: '/settings', 
    icon: CogIcon,
    children: [
      { name: 'Profil', href: '/settings?tab=profile' },
      { name: 'Sécurité', href: '/settings?tab=security' },
      { name: 'Notifications', href: '/settings?tab=notifications' },
      { name: 'Préférences', href: '/settings?tab=preferences' },
    ]
  },
];

const Sidebar = ({ isMobileOpen, onMobileToggle, isCollapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const sidebarRef = useRef(null);

  // Mettre à jour isMobile lors du redimensionnement
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gérer l'ouverture/fermeture des sous-menus
  const toggleSubMenu = useCallback((index) => {
    setActiveMenu(prev => prev === index ? null : index);
  }, []);

  // Fermer le menu mobile lors du clic sur un lien
  const handleNavClick = useCallback((href) => {
    console.log('Navigation vers:', href);
    if (isMobile) {
      onMobileToggle();
    }
  }, [isMobile, onMobileToggle]);

  // Composant pour l'icône de chevron
  const renderChevron = (isOpen) => {
    const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon;
    return (
      <Icon 
        className="ml-auto h-4 w-4 flex-shrink-0 transform transition-transform duration-200"
        style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
        aria-hidden="true"
      />
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
    <div className="relative">
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
        {/* En-tête avec logo, titre et bouton de réduction */}
        <div className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700">
          {/* Bouton de réduction - centré verticalement et horizontalement */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse();
            }}
            className="w-full h-full flex items-center justify-center p-4 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isCollapsed ? "Ouvrir le menu" : "Réduire le menu"}
          >
            {isCollapsed ? (
              <Bars3Icon className="h-6 w-6" />
            ) : (
              <div className="flex items-center w-full justify-between px-2">
                <span className="text-lg font-bold text-purple-400 whitespace-nowrap">
                  Gazoduc Invest
                </span>
                <ChevronLeftIcon className="h-6 w-6" />
              </div>
            )}
          </button>
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
          {!isCollapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse();
              }}
              className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Réduire le menu"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Contenu du menu */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden py-2">
          <nav className="px-3 space-y-1">
            {navigation.map((item, index) => (
              <div key={item.name}>
                {!item.children ? (
                  <NavLink
                    to={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      } ${isCollapsed ? 'justify-center' : ''}`
                    }
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
                              {renderChevron(open || location.pathname.startsWith(item.href))}
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
                                  onClick={() => handleNavClick(subItem.href)}
                                  className={({ isActive }) =>
                                    `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                      isActive
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                    }`
                                  }
                                >
                                  {subItem.name}
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

        {/* Bouton de déconnexion */}
        {user && (
          <div className="mt-auto border-t border-gray-200 dark:border-gray-700 p-3">
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-white hover:text-white hover:bg-red-600/80 dark:hover:bg-red-600/90 rounded-md transition-all duration-200 ${isCollapsed ? 'justify-center pl-2' : 'justify-center'}`}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              {!isCollapsed && <span>Déconnexion</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
