import { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import { Menu, Transition, Combobox, Dialog } from '@headlessui/react';
import { 
  BellIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon, 
  Cog6ToothIcon, 
  MoonIcon, 
  SunIcon, 
  ArrowRightOnRectangleIcon,
  ClockIcon,
  UserIcon,
  ChevronDownIcon,
  SparklesIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Icônes solides (si nécessaires)
import { 
  ClockIcon as ClockSolid, 
  UserIcon as UserSolid, 
  Cog6ToothIcon as CogSolid,
  MoonIcon as MoonSolid,
  SunIcon as SunSolid
} from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';

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
const searchCategories = [
  { 
    id: 1, 
    name: 'Investissements', 
    type: 'category',
    icon: ChartBarIcon,
    description: 'Rechercher dans les investissements',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30'
  },
  { 
    id: 2, 
    name: 'Transactions', 
    type: 'category',
    icon: CurrencyDollarIcon,
    description: 'Rechercher dans les transactions',
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900/30'
  },
  { 
    id: 3, 
    name: 'Portefeuille', 
    type: 'category',
    icon: DocumentTextIcon,
    description: 'Voir votre portefeuille',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30'
  },
  { 
    id: 4, 
    name: 'Rapports', 
    type: 'category',
    icon: DocumentTextIcon,
    description: 'Générer des rapports',
    color: 'text-amber-500',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30'
  },
];

// Recent searches with timestamps
const getRecentSearches = () => {
  const savedSearches = localStorage.getItem('recentSearches');
  return savedSearches ? JSON.parse(savedSearches) : [];
};

// Save a search to recent searches
const saveRecentSearch = (query) => {
  if (!query.trim()) return;
  
  const searches = getRecentSearches();
  const existingIndex = searches.findIndex(s => s.query.toLowerCase() === query.toLowerCase());
  
  if (existingIndex >= 0) {
    searches.splice(existingIndex, 1);
  }
  
  const newSearch = {
    id: Date.now(),
    query,
    type: 'recent',
    timestamp: new Date().toISOString()
  };
  
  const updatedSearches = [newSearch, ...searches].slice(0, 5);
  localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  return updatedSearches;
};

// Clear recent searches
const clearRecentSearches = () => {
  localStorage.removeItem('recentSearches');
  return [];
};

const Header = ({ onMenuToggle, isMenuOpen, isCollapsed = false }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [recentSearches, setRecentSearches] = useState(getRecentSearches());
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchButtonRef = useRef(null);
  
  // User menu items
  const userNavigation = [
    { name: 'Votre profil', href: '/settings', icon: UserIcon, activeIcon: UserSolid },
    { name: 'Déconnexion', action: 'logout', icon: ArrowRightOnRectangleIcon, danger: true },
  ];
  
  // Quick actions for search
  const quickActions = [
    { name: 'Nouvel investissement', icon: PlusCircleIcon, href: '/investments/new' },
    { name: 'Dépôt rapide', icon: ArrowDownTrayIcon, href: '/deposit' },
    { name: 'Retrait', icon: ArrowUpTrayIcon, href: '/withdraw' },
    { name: 'Rapport personnalisé', icon: DocumentChartBarIcon, href: '/reports/new' },
  ];
  
  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Aujourd'hui, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Cacher le header sur la page de connexion
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // Gestion du mode sombre
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Vérifier l'état de la connexion
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle search submission
  const handleSearch = useCallback((e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
      setRecentSearches(getRecentSearches());
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  }, [searchQuery, navigate]);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/login');
  }, [logout, navigate]);

  // Handle search input key down
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 w-full">
        <div className="px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between w-full">
            {/* Côté gauche - Bouton et titre alignés */}
            <div className="flex items-center flex-shrink-0">
              {/* Bouton de menu mobile */}
              <div className="flex items-center">
                <button
                  type="button"
                  className="md:hidden text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 p-1 rounded-md h-8 w-8 flex items-center justify-center"
                  onClick={onMenuToggle}
                  aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                >
                  {isMenuOpen ? (
                    <XMarkIcon className="h-5 w-5" />
                  ) : (
                    <Bars3Icon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Titre à côté du bouton */}
              <h1 className={`${isCollapsed ? 'ml-20' : 'ml-2'} pt-2 text-lg font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap flex items-center h-8 transition-all duration-300`}>
                Gazoduc Invest
              </h1>
            </div>

            {/* Côté droit - Tous les contrôles groupés */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Barre de recherche - Masquée sur mobile */}
              <div className="hidden md:block relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    ref={searchInputRef}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>
                
                {/* Search results dropdown */}
                {isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
                    {/* Recent searches */}
                    <div className="py-1">
                      <div className="px-4 py-2 flex items-center justify-between">
                        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Recherches récentes
                        </h3>
                        <button
                          type="button"
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearRecentSearches();
                            setRecentSearches([]);
                          }}
                        >
                          Tout effacer
                        </button>
                      </div>
                      
                      {recentSearches.length > 0 ? (
                        recentSearches.map((search) => (
                          <button
                            key={search.id}
                            type="button"
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 flex items-center"
                            onClick={() => {
                              setSearchQuery(search.query);
                              searchInputRef.current?.focus();
                            }}
                          >
                            <ClockIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <span className="truncate">{search.query}</span>
                            <span className="ml-auto text-xs text-gray-500">
                              {formatTimeAgo(search.timestamp)}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          Aucune recherche récente
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <h3 className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions rapides
                      </h3>
                      <div className="grid grid-cols-2 gap-2 p-2">
                        {quickActions.map((action) => (
                          <Link
                            key={action.name}
                            to={action.href}
                            className="flex flex-col items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 text-sm text-center"
                          >
                            <action.icon className="h-5 w-5 text-blue-500 mb-1" />
                            <span className="text-xs text-gray-700 dark:text-gray-300">
                              {action.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                      <h3 className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Parcourir
                      </h3>
                      <div className="grid grid-cols-4 gap-2">
                        {searchCategories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => {
                              navigate(category.href || '#');
                              setIsSearchFocused(false);
                            }}
                            className="flex flex-col items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50"
                          >
                            <div className={`h-8 w-8 rounded-full ${category.bgColor} flex items-center justify-center mb-1`}>
                              <category.icon className={`h-4 w-4 ${category.color}`} />
                            </div>
                            <span className="text-xs text-gray-700 dark:text-gray-300">
                              {category.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Bouton de thème */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
              
              {/* Bouton de notifications */}
              <button
                type="button"
                className="p-2 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative"
                aria-label="Notifications"
              >
                <span className="sr-only">Voir les notifications</span>
                <div className="relative">
                  <BellIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white ring-2 ring-white dark:ring-gray-800">
                    3
                  </span>
                </div>
              </button>
              
              {/* Menu utilisateur */}
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <span className="sr-only">Ouvrir le menu utilisateur</span>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    {/* En-tête avec informations utilisateur */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{getUserDisplayName(user)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                    </div>
                    
                    {/* Contenu du menu utilisateur */}
                    <div className="py-1">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                if (item.action === 'logout') {
                                  setIsLogoutModalOpen(true);
                                } else if (item.href) {
                                  navigate(item.href);
                                }
                              }}
                              className={`${
                                active ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200'
                              } group flex items-center px-4 py-2 text-sm w-full text-left ${
                                item.danger ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30' : ''
                              }`}
                            >
                              <item.icon
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                                aria-hidden="true"
                              />
                              {item.name}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </header>
      
      {/* Modale de confirmation de déconnexion */}
      <Transition appear show={isLogoutModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => setIsLogoutModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Déconnexion
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Êtes-vous sûr de vouloir vous déconnecter ?
                  </p>
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                    onClick={() => setIsLogoutModalOpen(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={handleLogout}
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Header;
