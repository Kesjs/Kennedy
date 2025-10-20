import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import {
  FiUser,
  FiShield,
  FiBell,
  FiSettings,
  FiMonitor,
  FiKey,
  FiMail,
  FiPhone,
  FiGlobe,
  FiMoon,
  FiSun,
  FiCheck,
  FiTrendingUp,
  FiAlertTriangle,
  FiAlertCircle,
  FiTarget,
  FiDollarSign,
  FiBarChart
} from 'react-icons/fi';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import api from '../../services/api';

// Composant de chargement amélioré
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-12 space-y-4">
    <div className="animate-spin rounded-full h-14 w-14 border-4 border-purple-500 border-t-transparent"></div>
    <p className="text-gray-500 dark:text-gray-400">Chargement des paramètres...</p>
  </div>
);

// Onglets de paramètres
const tabs = [
  { id: 'profile', name: 'Profil', icon: FiUser, description: 'Informations personnelles' },
  { id: 'investment', name: 'Investissement', icon: FiTrendingUp, description: 'Préférences d\'investissement' },
  { id: 'security', name: 'Sécurité', icon: FiShield, description: 'Mot de passe et authentification' },
  { id: 'notifications', name: 'Notifications', icon: FiBell, description: 'Préférences d\'alertes' },
  { id: 'preferences', name: 'Préférences', icon: FiSettings, description: 'Interface et paramètres' },
];

const SettingsPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Gérer les paramètres d'URL pour les onglets
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['profile', 'investment', 'security', 'notifications', 'preferences'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full h-full overflow-auto p-0 m-0 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
          <p className="mt-1 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Gérez vos paramètres personnels et de sécurité
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation latérale */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 sm:p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-white' : ''}`} />
                      <div>
                        <div className={`font-medium ${activeTab === tab.id ? 'text-white' : ''}`}>
                          {tab.name}
                        </div>
                        <div className={`text-xs mt-0.5 ${activeTab === tab.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 sm:p-6">
                {activeTab === 'profile' && <ProfileSettings />}
                {activeTab === 'investment' && <InvestmentSettings />}
                {activeTab === 'security' && <SecuritySettings />}
                {activeTab === 'notifications' && <NotificationSettings />}
                {activeTab === 'preferences' && <PreferenceSettings />}
              </div>
            </div>
          </div>
        </div>
      </div>
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
const ProfileSettings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logique de sauvegarde
    console.log('Sauvegarde profil:', formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Informations personnelles</h2>
        <p className="text-gray-600 dark:text-gray-300">Mettez à jour vos informations de profil</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prénom
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
          >
            Sauvegarder les modifications
          </button>
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
