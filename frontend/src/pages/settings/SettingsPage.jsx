import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiShield, FiBell, FiSettings, FiMonitor, FiKey, FiMail, FiPhone, 
  FiGlobe, FiMoon, FiSun, FiCheck, FiTrendingUp, FiAlertTriangle, FiAlertCircle, 
  FiTarget, FiDollarSign, FiBarChart, FiCamera, FiEdit2, FiChevronDown, FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import api from '../../services/api';

// Animation pour les transitions
const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { 
      duration: 0.2,
      ease: 'easeInOut' 
    }
  }
};

// Composant de chargement amélioré avec animation
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-12">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-14 h-14 rounded-full border-4 border-purple-500 border-t-transparent"
    />
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-6 text-gray-500 dark:text-gray-400 text-center"
    >
      Chargement de vos paramètres...
    </motion.p>
  </div>
);

// Composant d'onglet personnalisé
const TabButton = ({ tab, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center p-4 rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
    }`}
  >
    <tab.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-purple-500'}`} />
    <div className="text-left">
      <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        {tab.name}
      </div>
      <div className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
        {tab.description}
      </div>
    </div>
  </motion.button>
);

// Menu déroulant pour le profil utilisateur
const ProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer le menu en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="relative">
          <img
            src={user?.user_metadata?.avatar_url || '/default-avatar.png'}
            alt={user?.user_metadata?.full_name || 'Utilisateur'}
            className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.user_metadata?.full_name || 'Utilisateur'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.email || ''}
          </p>
        </div>
        <FiChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.user_metadata?.full_name || 'Utilisateur'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || ''}
              </p>
            </div>
            <div className="py-1">
              <button
                onClick={() => {
                  // Rediriger vers les paramètres de profil
                  window.location.href = '/settings?tab=profile';
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
              >
                <FiUser className="mr-3 w-4 h-4" />
                Mon profil
              </button>
              <button
                onClick={() => {
                  // Rediriger vers les paramètres de sécurité
                  window.location.href = '/settings?tab=security';
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
              >
                <FiShield className="mr-3 w-4 h-4" />
                Sécurité
              </button>
            </div>
            <div className="py-1 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center"
              >
                <FiLogOut className="mr-3 w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// Onglets de paramètres
const tabs = [
  { id: 'profile', name: 'Profil', icon: FiUser, description: 'Informations personnelles' },
  { id: 'investment', name: 'Investissement', icon: FiTrendingUp, description: 'Préférences d\'investissement' },
  { id: 'security', name: 'Sécurité', icon: FiShield, description: 'Mot de passe et authentification' },
  { id: 'notifications', name: 'Notifications', icon: FiBell, description: 'Préférences d\'alertes' },
  { id: 'preferences', name: 'Préférences', icon: FiSettings, description: 'Interface et paramètres' },
];

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Gérer les paramètres d'URL pour les onglets
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && tabs.some(tab => tab.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Gestion du défilement pour l'effet de l'en-tête
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* En-tête fixe */}
      <header className={`sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 transition-shadow duration-300 ${
        isScrolled ? 'shadow-sm' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 mr-4"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ProfileDropdown user={user} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation latérale */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Carte de profil */}
              <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={user?.user_metadata?.avatar_url || '/default-avatar.png'}
                      alt={user?.user_metadata?.full_name || 'Utilisateur'}
                      className="w-16 h-16 rounded-full border-2 border-white/80"
                    />
                    <button className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md text-purple-600 hover:bg-purple-50 transition-colors">
                      <FiCamera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{user?.user_metadata?.full_name || 'Utilisateur'}</h2>
                    <p className="text-sm text-white/80">{user?.email || ''}</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => (
                  <TabButton
                    key={tab.id}
                    tab={tab}
                    isActive={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  />
                ))}
              </nav>
            </div>

            {/* Carte d'aide */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30">
              <div className="text-indigo-600 dark:text-indigo-400 mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Notre équipe est là pour vous aider avec vos paramètres et préférences.</p>
              <button className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium py-2 px-4 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors">
                Contacter le support
              </button>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6 sm:p-8">
                  {activeTab === 'profile' && <ProfileSettings user={user} />}
                  {activeTab === 'investment' && <InvestmentSettings />}
                  {activeTab === 'security' && <SecuritySettings />}
                  {activeTab === 'notifications' && <NotificationSettings />}
                  {activeTab === 'preferences' && <PreferenceSettings />}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

// Section Investissement
const InvestmentSettings = () => {
  const [investmentSettings, setInvestmentSettings] = useState({
    riskTolerance: 'moderate',
    autoInvest: false,
    monthlyBudget: 1000,
    alertThresholds: {
      profit: 10,
      loss: -5,
      balance: 500
    },
    notifications: {
      dailyReport: true,
      weeklyReport: false,
      monthlyReport: true,
      priceAlerts: true
    },
    reinvestProfits: true,
    stopLoss: 15,
    takeProfit: 25
  });

  const handleSettingChange = (category, key, value) => {
    setInvestmentSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleTopLevelChange = (key, value) => {
    setInvestmentSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Préférences d'investissement</h2>
        <p className="text-gray-600 dark:text-gray-300">Configurez vos paramètres d'investissement et de trading automatique</p>
      </div>

      {/* Profil de risque et budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FiTarget className="w-6 h-6 text-purple-500 mr-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profil de risque</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="riskTolerance"
                value="conservative"
                checked={investmentSettings.riskTolerance === 'conservative'}
                onChange={(e) => handleTopLevelChange('riskTolerance', e.target.value)}
                className="text-purple-500 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Conservateur (faible risque)</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="riskTolerance"
                value="moderate"
                checked={investmentSettings.riskTolerance === 'moderate'}
                onChange={(e) => handleTopLevelChange('riskTolerance', e.target.value)}
                className="text-purple-500 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Modéré (risque équilibré)</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="riskTolerance"
                value="aggressive"
                checked={investmentSettings.riskTolerance === 'aggressive'}
                onChange={(e) => handleTopLevelChange('riskTolerance', e.target.value)}
                className="text-purple-500 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Agressif (haut risque)</span>
            </label>
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FiDollarSign className="w-6 h-6 text-green-500 mr-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Budget mensuel</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Montant d'investissement automatique (€)
            </label>
            <input
              type="number"
              value={investmentSettings.monthlyBudget}
              onChange={(e) => handleTopLevelChange('monthlyBudget', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="100"
              step="50"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Minimum 100€ recommandé
            </p>
          </div>
        </div>
      </div>

      {/* Seuils d'alerte */}
      <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <FiAlertTriangle className="w-6 h-6 text-orange-500 mr-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Seuils d'alerte</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alerte bénéfice (%)
            </label>
            <input
              type="number"
              value={investmentSettings.alertThresholds.profit}
              onChange={(e) => handleSettingChange('alertThresholds', 'profit', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alerte perte (%)
            </label>
            <input
              type="number"
              value={Math.abs(investmentSettings.alertThresholds.loss)}
              onChange={(e) => handleSettingChange('alertThresholds', 'loss', -Math.abs(parseFloat(e.target.value)))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              step="0.1"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Seuil balance (€)
            </label>
            <input
              type="number"
              value={investmentSettings.alertThresholds.balance}
              onChange={(e) => handleSettingChange('alertThresholds', 'balance', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="100"
            />
          </div>
        </div>
      </div>

      {/* Trading automatique */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FiTrendingUp className="w-6 h-6 text-blue-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Trading automatique</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={investmentSettings.autoInvest}
                onChange={(e) => handleTopLevelChange('autoInvest', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Activez le réinvestissement automatique des bénéfices selon votre profil de risque
          </p>

          {investmentSettings.autoInvest && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stop Loss (%)
                  </label>
                  <input
                    type="number"
                    value={investmentSettings.stopLoss}
                    onChange={(e) => handleTopLevelChange('stopLoss', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    step="0.1"
                    min="1"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Take Profit (%)
                  </label>
                  <input
                    type="number"
                    value={investmentSettings.takeProfit}
                    onChange={(e) => handleTopLevelChange('takeProfit', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    step="0.1"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FiBarChart className="w-6 h-6 text-indigo-500 mr-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Réinvestissement</h3>
          </div>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={investmentSettings.reinvestProfits}
              onChange={(e) => handleTopLevelChange('reinvestProfits', e.target.checked)}
              className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              Réinvestir automatiquement les bénéfices
            </span>
          </label>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Les bénéfices seront automatiquement réinvestis selon votre profil de risque
          </p>
        </div>
      </div>

      {/* Rapports et notifications */}
      <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <FiBarChart className="w-6 h-6 text-teal-500 mr-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Rapports d'investissement</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Rapports automatiques</h4>
            <div className="space-y-2">
              {Object.entries(investmentSettings.notifications).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                    className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {key === 'dailyReport' ? 'Rapport quotidien' :
                     key === 'weeklyReport' ? 'Rapport hebdomadaire' :
                     key === 'monthlyReport' ? 'Rapport mensuel' : 'Alertes de prix'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Informations incluses</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p>• Performance du portefeuille</p>
              <p>• Transactions récentes</p>
              <p>• Évolution des gazoducs</p>
              <p>• Prévisions de rendement</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
          Sauvegarder les paramètres d'investissement
        </button>
      </div>
    </div>
  );
};
const ProfileSettings = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      country: user?.user_metadata?.country || 'FR',
      bio: user?.user_metadata?.bio || '',
    }
  });

  // Gestion du changement de photo de profil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      // Ici, vous pourriez ajouter la logique pour télécharger l'image
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);
      // Ici, vous ajouterez la logique pour mettre à jour le profil
      // Exemple : await api.updateProfile(user.id, data);
      
      // Si vous avez une fonction pour rafraîchir les données utilisateur, appelez-la ici
      // await refreshUserData();
      
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Une erreur est survenue lors de la mise à jour du profil');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profil Utilisateur</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setIsEditing(false);
                  setPreviewImage(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                disabled={isUploading}
              >
                Annuler
              </button>
              <button
                type="submit"
                form="profile-form"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : 'Enregistrer les modifications'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center"
            >
              <FiEdit2 className="mr-2 w-4 h-4" />
              Modifier le profil
            </button>
          )}
        </div>
      </div>

      <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section Photo de profil */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Photo de profil</h3>
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
            <div className="relative mb-4 sm:mb-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={previewImage || user?.user_metadata?.avatar_url || '/default-avatar.png'}
                  alt={user?.user_metadata?.full_name || 'Utilisateur'}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md border border-gray-200 dark:border-gray-600 text-purple-600 dark:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiCamera className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </>
              )}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isEditing 
                  ? 'Formats supportés : JPG, PNG, GIF. Taille maximale : 5 Mo' 
                  : 'Cliquez sur "Modifier le profil" pour changer votre photo'}
              </p>
            </div>
          </div>
        </div>

        {/* Section Informations personnelles */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informations personnelles</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Ces informations seront visibles par les autres utilisateurs.
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  {...register('fullName', { required: 'Ce champ est requis' })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.fullName 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors ${!isEditing ? 'bg-gray-50 dark:bg-gray-700/50' : ''}`}
                  placeholder="Votre nom complet"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Adresse email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', { 
                    required: 'Ce champ est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Adresse email invalide'
                    }
                  })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors ${!isEditing ? 'bg-gray-50 dark:bg-gray-700/50' : ''}`}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Téléphone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:border-transparent transition-colors disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-700/50"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pays
                </label>
                <select
                  id="country"
                  {...register('country')}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:border-transparent transition-colors disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-700/50"
                >
                  <option value="FR">France</option>
                  <option value="BE">Belgique</option>
                  <option value="CH">Suisse</option>
                  <option value="LU">Luxembourg</option>
                  <option value="CA">Canada</option>
                  <option value="MA">Maroc</option>
                  <option value="TN">Tunisie</option>
                  <option value="DZ">Algérie</option>
                  <option value="SN">Sénégal</option>
                  <option value="CI">Côte d'Ivoire</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                À propos de moi
              </label>
              <textarea
                id="bio"
                {...register('bio')}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:border-transparent transition-colors disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-700/50"
                placeholder="Décrivez-vous en quelques mots..."
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Décrivez-vous brièvement (optionnel)
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

// Section Sécurité
const SecuritySettings = () => {
  const [activeTab, setActiveTab] = useState('password');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPasswordForm, formState: { errors: passwordErrors }, watch } = useForm();
  const { register: register2FA, handleSubmit: handle2FASubmit, formState: { errors: twoFAErrors } } = useForm();

  // Mutation pour changer le mot de passe
  const changePasswordMutation = useMutation({
    mutationFn: (data) => api.patch('/api/user/change-password', data),
    onSuccess: () => {
      setSuccessMessage('Votre mot de passe a été mis à jour avec succès.');
      resetPasswordForm();
      setTimeout(() => setSuccessMessage(''), 5000);
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || 'Une erreur est survenue lors du changement de mot de passe');
      setTimeout(() => setErrorMessage(''), 5000);
    },
  });

  // Mutation pour activer/désactiver la 2FA
  const toggle2FAMutation = useMutation({
    mutationFn: (enabled) => api.post('/api/user/two-factor-authentication', { enabled }),
    onSuccess: (response, variables) => {
      const enabled = variables;
      setTwoFactorAuth(enabled);
      if (enabled) {
        setBackupCodes(response.data.backupCodes);
        setShowBackupCodes(true);
      }
      setSuccessMessage(`L'authentification à deux facteurs a été ${enabled ? 'activée' : 'désactivée'} avec succès.`);
      setTimeout(() => setSuccessMessage(''), 5000);
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || 'Une erreur est survenue lors de la modification des paramètres de sécurité');
      setTimeout(() => setErrorMessage(''), 5000);
    },
  });

  const handlePasswordSubmitForm = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await changePasswordMutation.mutate({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
    }
  };

  const handle2FAToggle = async (enabled) => {
    try {
      await toggle2FAMutation.mutate(enabled);
    } catch (error) {
      console.error('Erreur lors du toggle 2FA:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sécurité du compte</h2>
        <p className="text-gray-600 dark:text-gray-300">Gérez vos paramètres de sécurité et d'authentification</p>
      </div>

      {/* Messages de succès et d'erreur */}
      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-200 rounded">
          <div className="flex">
            <FiCheck className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
            <div>{successMessage}</div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-200 rounded">
          <div className="flex">
            <FiAlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0" />
            <div>{errorMessage}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Changement de mot de passe */}
        <div className="space-y-4">
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <FiKey className="w-6 h-6 text-purple-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Changer le mot de passe</h3>
            </div>

            <form onSubmit={handlePasswordSubmit(handlePasswordSubmitForm)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  {...registerPassword('currentPassword', { required: 'Ce champ est requis' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  {...registerPassword('newPassword', {
                    required: 'Ce champ est requis',
                    minLength: { value: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  {...registerPassword('confirmPassword', {
                    required: 'Ce champ est requis',
                    validate: value => value === watch('newPassword') || 'Les mots de passe ne correspondent pas'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {changePasswordMutation.isPending ? 'Modification...' : 'Changer le mot de passe'}
              </button>
            </form>
          </div>
        </div>

        {/* Authentification à deux facteurs */}
        <div className="space-y-4">
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FiShield className="w-6 h-6 text-blue-500 mr-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Authentification 2FA</h3>
              </div>
              <button
                onClick={() => handle2FAToggle(!twoFactorAuth)}
                disabled={toggle2FAMutation.isPending}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  twoFactorAuth
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {toggle2FAMutation.isPending ? '...' : (twoFactorAuth ? 'Désactiver' : 'Activer')}
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {twoFactorAuth
                ? 'L\'authentification à deux facteurs est activée. Votre compte est protégé par une couche de sécurité supplémentaire.'
                : 'Ajoutez une couche de sécurité supplémentaire à votre compte avec l\'authentification à deux facteurs.'
              }
            </p>

            {showBackupCodes && backupCodes.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Codes de secours</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                  Sauvegardez ces codes dans un endroit sûr. Vous pourrez les utiliser pour accéder à votre compte si vous perdez votre appareil.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <code key={index} className="block p-2 bg-white dark:bg-gray-800 border rounded text-sm font-mono">
                      {code}
                    </code>
                  ))}
                </div>
                <button
                  onClick={() => setShowBackupCodes(false)}
                  className="mt-3 text-sm text-yellow-800 dark:text-yellow-200 hover:underline"
                >
                  Masquer les codes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sessions actives */}
      <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <FiMonitor className="w-6 h-6 text-indigo-500 mr-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sessions actives</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Gérez les appareils connectés à votre compte
        </p>
        <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
          Voir les sessions actives
        </button>
      </div>
    </div>
  );
};

// Section Notifications
const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    email: {
      deposits: true,
      withdrawals: true,
      investments: false,
      security: true,
    },
    push: {
      deposits: false,
      withdrawals: true,
      investments: true,
      security: true,
    }
  });

  const handleNotificationChange = (type, category, value) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [category]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Préférences de notifications</h2>
        <p className="text-gray-600 dark:text-gray-300">Choisissez comment vous souhaitez être notifié</p>
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FiMail className="w-6 h-6 text-green-500 mr-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications par email</h3>
          </div>

          <div className="space-y-3">
            {Object.entries(notifications.email).map(([key, value]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleNotificationChange('email', key, e.target.checked)}
                  className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">
                  {key === 'deposits' ? 'Dépôts' :
                   key === 'withdrawals' ? 'Retraits' :
                   key === 'investments' ? 'Investissements' : 'Sécurité'}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FiBell className="w-6 h-6 text-orange-500 mr-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications push</h3>
          </div>

          <div className="space-y-3">
            {Object.entries(notifications.push).map(([key, value]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleNotificationChange('push', key, e.target.checked)}
                  className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">
                  {key === 'deposits' ? 'Dépôts' :
                   key === 'withdrawals' ? 'Retraits' :
                   key === 'investments' ? 'Investissements' : 'Sécurité'}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Section Préférences
const PreferenceSettings = () => {
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'fr',
    currency: 'EUR',
    timezone: 'Europe/Paris',
  });

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Préférences d'interface</h2>
        <p className="text-gray-600 dark:text-gray-300">Personnalisez votre expérience utilisateur</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Thème
          </label>
          <select
            value={preferences.theme}
            onChange={(e) => handlePreferenceChange('theme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
            <option value="auto">Automatique</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Langue
          </label>
          <select
            value={preferences.language}
            onChange={(e) => handlePreferenceChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Devise
          </label>
          <select
            value={preferences.currency}
            onChange={(e) => handlePreferenceChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dollar ($)</option>
            <option value="GBP">Livre (£)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fuseau horaire
          </label>
          <select
            value={preferences.timezone}
            onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="Europe/Paris">Europe/Paris</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
          Sauvegarder les préférences
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
