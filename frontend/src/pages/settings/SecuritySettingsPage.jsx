import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const SecuritySettingsPage = () => {
  const [activeTab, setActiveTab] = useState('password');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPasswordForm, formState: { errors: passwordErrors }, watch } = useForm();
  const { register: register2FA, handleSubmit: handle2FASubmit, formState: { errors: twoFAErrors } } = useForm();

  // Mutation pour changer le mot de passe
  const changePasswordMutation = useMutation(
    (data) => api.patch('/api/user/change-password', data),
    {
      onSuccess: () => {
        setSuccessMessage('Votre mot de passe a été mis à jour avec succès.');
        resetPasswordForm();
        setTimeout(() => setSuccessMessage(''), 5000);
      },
      onError: (error) => {
        setErrorMessage(error.response?.data?.message || 'Une erreur est survenue lors du changement de mot de passe');
        setTimeout(() => setErrorMessage(''), 5000);
      },
    }
  );

  // Mutation pour activer/désactiver la 2FA
  const toggle2FAMutation = useMutation(
    (enabled) => api.post('/api/user/two-factor-authentication', { enabled }),
    {
      onSuccess: (response, enabled) => {
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
    }
  );

  // Soumettre le formulaire de changement de mot de passe
  const onSubmitPassword = (data) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  // Soumettre le code de vérification 2FA
  const onSubmit2FACode = (data) => {
    // Vérifier le code 2FA
    api.post('/api/user/two-factor-challenge', { code: data.code })
      .then(() => {
        setSuccessMessage('Code de vérification validé avec succès.');
        setTimeout(() => setSuccessMessage(''), 5000);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.message || 'Code de vérification invalide');
        setTimeout(() => setErrorMessage(''), 5000);
      });
  };

  // Générer de nouveaux codes de secours
  const generateNewBackupCodes = () => {
    api.post('/api/user/two-factor-recovery-codes')
      .then((response) => {
        setBackupCodes(response.data.codes);
        setSuccessMessage('De nouveaux codes de secours ont été générés.');
        setTimeout(() => setSuccessMessage(''), 5000);
      })
      .catch((error) => {
        setErrorMessage('Une erreur est survenue lors de la génération des codes de secours');
        setTimeout(() => setErrorMessage(''), 5000);
      });
  };

  // Récupérer l'état actuel de la 2FA (à implémenter avec une requête API réelle)
  // useEffect(() => {
  //   api.get('/api/user/two-factor-authentication')
  //     .then(response => setTwoFactorAuth(response.data.enabled));
  // }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Paramètres de sécurité</h1>
        <p className="mt-1 text-gray-400">
          Gérez les paramètres de sécurité de votre compte
        </p>
      </div>

      {/* Messages de succès et d'erreur */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Onglets */}
      <div className="border-b border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('password')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
            }`}
          >
            Mot de passe
          </button>
          <button
            onClick={() => setActiveTab('2fa')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === '2fa'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
            }`}
          >
            Authentification à deux facteurs
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sessions'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
            }`}
          >
            Sessions actives
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        {/* Onglet Mot de passe */}
        {activeTab === 'password' && (
          <div>
            <h2 className="text-lg font-medium text-white mb-6">Changer de mot de passe</h2>
            <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="max-w-md space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  {...registerPassword('currentPassword', { required: 'Le mot de passe actuel est requis' })}
                  className={`w-full px-3 py-2 bg-gray-700 border ${
                    passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-600'
                  } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500`}
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-500">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="newPassword"
                  {...registerPassword('newPassword', {
                    required: 'Le nouveau mot de passe est requis',
                    minLength: {
                      value: 8,
                      message: 'Le mot de passe doit contenir au moins 8 caractères',
                    },
                  })}
                  className={`w-full px-3 py-2 bg-gray-700 border ${
                    passwordErrors.newPassword ? 'border-red-500' : 'border-gray-600'
                  } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500`}
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  {...registerPassword('confirmPassword', {
                    validate: (value) =>
                      value === watch('newPassword') || 'Les mots de passe ne correspondent pas',
                  })}
                  className={`w-full px-3 py-2 bg-gray-700 border ${
                    passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                  } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500`}
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={changePasswordMutation.isLoading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                >
                  {changePasswordMutation.isLoading ? 'Enregistrement...' : 'Mettre à jour le mot de passe'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Onglet Authentification à deux facteurs */}
        {activeTab === '2fa' && (
          <div>
            <h2 className="text-lg font-medium text-white mb-6">Authentification à deux facteurs (2FA)</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-900/50 p-6 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-md font-medium text-white">Authentification à deux facteurs</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Ajoutez une couche de sécurité supplémentaire à votre compte en activant l'authentification à deux facteurs.
                    </p>
                  </div>
                  <button
                    onClick={() => toggle2FAMutation.mutate(!twoFactorAuth)}
                    disabled={toggle2FAMutation.isLoading}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      twoFactorAuth
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {toggle2FAMutation.isLoading ? (
                      'Chargement...'
                    ) : twoFactorAuth ? (
                      'Désactiver la 2FA'
                    ) : (
                      'Activer la 2FA'
                    )}
                  </button>
                </div>

                {twoFactorAuth && (
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <h4 className="text-sm font-medium text-white mb-3">Configuration de l'authentification à deux facteurs</h4>
                    
                    <div className="bg-black/50 p-4 rounded-lg border border-gray-700">
                      <div className="flex flex-col md:flex-row items-start md:items-center">
                        <div className="mb-4 md:mb-0 md:mr-6">
                          {/* QR Code pour l'application d'authentification */}
                          <div className="bg-white p-2 rounded inline-block">
                            <div className="w-40 h-40 flex items-center justify-center bg-white">
                              <span className="text-xs text-gray-600">[QR Code]</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-300 mb-3">
                            Scannez ce QR code avec votre application d'authentification préférée (comme Google Authenticator ou Authy) pour configurer la 2FA.
                          </p>
                          
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-300 mb-1">Ou entrez cette clé manuellement :</p>
                            <div className="flex items-center bg-gray-800 rounded-md p-2">
                              <code className="text-sm font-mono text-purple-400">JBSWY3DPEHPK3PXP</code>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText('JBSWY3DPEHPK3PXP');
                                  setSuccessMessage('Clé copiée dans le presse-papiers');
                                  setTimeout(() => setSuccessMessage(''), 3000);
                                }}
                                className="ml-2 p-1 text-gray-400 hover:text-white"
                                title="Copier la clé"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <form onSubmit={handle2FASubmit(onSubmit2FACode)} className="space-y-3">
                            <div>
                              <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-1">
                                Code de vérification
                              </label>
                              <input
                                type="text"
                                id="code"
                                {...register2FA('code', {
                                  required: 'Le code de vérification est requis',
                                  pattern: {
                                    value: /^[0-9]{6}$/,
                                    message: 'Le code doit contenir 6 chiffres',
                                  },
                                })}
                                className={`w-full px-3 py-2 bg-gray-700 border ${
                                  twoFAErrors.code ? 'border-red-500' : 'border-gray-600'
                                } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500`}
                                placeholder="123456"
                              />
                              {twoFAErrors.code && (
                                <p className="mt-1 text-sm text-red-500">{twoFAErrors.code.message}</p>
                              )}
                            </div>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors"
                            >
                              Vérifier le code
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* Codes de secours */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-white mb-3">Codes de secours</h4>
                      <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-300 mb-3">
                          Les codes de secours peuvent être utilisés pour accéder à votre compte si vous perdez l'accès à votre appareil d'authentification.
                          {!showBackupCodes && (
                            <button
                              onClick={() => setShowBackupCodes(true)}
                              className="ml-2 text-purple-400 hover:text-purple-300 text-sm font-medium"
                            >
                              Afficher les codes
                            </button>
                          )}
                        </p>
                        
                        {showBackupCodes && (
                          <>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              {backupCodes.length > 0 ? (
                                backupCodes.map((code, index) => (
                                  <div key={index} className="bg-black/30 p-2 rounded text-center font-mono text-sm">
                                    {code}
                                  </div>
                                ))
                              ) : (
                                <div className="col-span-2 text-center py-4 text-gray-400">
                                  Aucun code de secours généré
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={generateNewBackupCodes}
                                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded transition-colors"
                              >
                                Générer de nouveaux codes
                              </button>
                              <button
                                onClick={() => {
                                  const codesText = backupCodes.join('\n');
                                  navigator.clipboard.writeText(codesText);
                                  setSuccessMessage('Codes copiés dans le presse-papiers');
                                  setTimeout(() => setSuccessMessage(''), 3000);
                                }}
                                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded transition-colors"
                              >
                                Copier les codes
                              </button>
                              <button
                                onClick={() => {
                                  const codesText = backupCodes.join('\n');
                                  const blob = new Blob([codesText], { type: 'text/plain' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = 'codes-de-secours.txt';
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  URL.revokeObjectURL(url);
                                }}
                                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded transition-colors"
                              >
                                Télécharger
                              </button>
                            </div>
                            <p className="mt-3 text-xs text-yellow-400">
                              ⚠️ Conservez ces codes en lieu sûr. Ils ne seront affichés qu'une seule fois.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Onglet Sessions actives */}
        {activeTab === 'sessions' && (
          <div>
            <h2 className="text-lg font-medium text-white mb-6">Sessions actives</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-500/10 rounded-md">
                      <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-white">Windows 10 • Chrome</h3>
                      <p className="text-xs text-gray-400">Paris, France • Dernière activité il y a 2 heures</p>
                      <p className="text-xs text-green-400 mt-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"></span>
                        Cette session
                      </p>
                    </div>
                  </div>
                  <button
                    disabled
                    className="px-3 py-1 text-xs bg-gray-700 text-gray-400 rounded cursor-not-allowed"
                  >
                    Actuel
                  </button>
                </div>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-500/10 rounded-md">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-white">macOS • Safari</h3>
                      <p className="text-xs text-gray-400">Lyon, France • Dernière activité il y a 2 jours</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-xs text-red-400 hover:text-red-300 border border-red-500/50 hover:bg-red-500/10 rounded transition-colors">
                    Se déconnecter
                  </button>
                </div>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-500/10 rounded-md">
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-white">iPhone 13 • Safari</h3>
                      <p className="text-xs text-gray-400">Bruxelles, Belgique • Dernière activité il y a 1 semaine</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-xs text-red-400 hover:text-red-300 border border-red-500/50 hover:bg-red-500/10 rounded transition-colors">
                    Se déconnecter
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-sm font-medium text-white mb-3">Sécurité avancée</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-white">Déconnexion de tous les appareils</h4>
                    <p className="text-xs text-gray-400">Déconnectez-vous de tous les appareils sauf celui-ci</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors">
                    Tout déconnecter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
