import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfileForm, formState: { errors: profileErrors } } = useForm();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPasswordForm, formState: { errors: passwordErrors }, watch } = useForm();

  // Récupérer les données du profil utilisateur
  const { data: userProfile, isLoading } = useQuery(
    ['userProfile'],
    async () => {
      const response = await api.get('/api/user/profile');
      return response.data;
    },
    {
      onSuccess: (data) => {
        resetProfileForm({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || '',
          postalCode: data.postalCode || '',
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
        });
        if (data.avatar) {
          setAvatarPreview(`${process.env.REACT_APP_API_URL}/uploads/avatars/${data.avatar}`);
        }
      },
      onError: (error) => {
        console.error('Error fetching user profile:', error);
      },
    }
  );

  // Mutation pour mettre à jour le profil
  const updateProfileMutation = useMutation(
    (data) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'avatar' && data[key]) {
          formData.append('avatar', data.avatar[0]);
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      return api.patch('/api/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    {
      onSuccess: (response) => {
        updateUser(response.data.user);
        setSuccessMessage('Profil mis à jour avec succès');
        setIsEditing(false);
        setSelectedFile(null);
        setTimeout(() => setSuccessMessage(''), 5000);
      },
      onError: (error) => {
        setErrorMessage(error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du profil');
        setTimeout(() => setErrorMessage(''), 5000);
      },
    }
  );

  // Mutation pour changer le mot de passe
  const changePasswordMutation = useMutation(
    (data) => api.patch('/api/user/change-password', data),
    {
      onSuccess: () => {
        setSuccessMessage('Mot de passe mis à jour avec succès');
        resetPasswordForm();
        setIsChangingPassword(false);
        setTimeout(() => setSuccessMessage(''), 5000);
      },
      onError: (error) => {
        setErrorMessage(error.response?.data?.message || 'Une erreur est survenue lors du changement de mot de passe');
        setTimeout(() => setErrorMessage(''), 5000);
      },
    }
  );

  // Gérer le changement de fichier d'avatar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Soumettre le formulaire de profil
  const onSubmitProfile = (data) => {
    if (selectedFile) {
      data.avatar = selectedFile;
    }
    updateProfileMutation.mutate(data);
  };

  // Soumettre le formulaire de mot de passe
  const onSubmitPassword = (data) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    resetProfileForm({
      firstName: userProfile?.firstName,
      lastName: userProfile?.lastName,
      email: userProfile?.email,
      phone: userProfile?.phone || '',
      address: userProfile?.address || '',
      city: userProfile?.city || '',
      country: userProfile?.country || '',
      postalCode: userProfile?.postalCode || '',
      dateOfBirth: userProfile?.dateOfBirth ? new Date(userProfile.dateOfBirth).toISOString().split('T')[0] : '',
    });
    setSelectedFile(null);
    setAvatarPreview(userProfile?.avatar ? `${process.env.REACT_APP_API_URL}/uploads/avatars/${userProfile.avatar}` : '');
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gray-700 overflow-hidden border-2 border-purple-500">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-600 text-white text-2xl font-bold">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-1.5 cursor-pointer hover:bg-purple-700 transition-colors">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <div className="mt-3 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {user?.isEmailVerified ? 'Email vérifié' : 'Email non vérifié'}
              </div>
              {!user?.isEmailVerified && (
                <button className="mt-2 text-xs text-purple-400 hover:text-purple-300">
                  Renvoyer l'email de vérification
                </button>
              )}
            </div>

            <div className="mt-6">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'profile'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${
                      activeTab === 'profile' ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profil
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'security'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${
                      activeTab === 'security' ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Sécurité
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'notifications'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${
                      activeTab === 'notifications' ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'preferences'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${
                      activeTab === 'preferences' ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Préférences
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'activity'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${
                      activeTab === 'activity' ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  Activité
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1">
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

          {/* Onglet Profil */}
          {activeTab === 'profile' && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Informations du profil</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    Modifier le profil
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-md transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleProfileSubmit(onSubmitProfile)}
                      disabled={updateProfileMutation.isLoading}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                    >
                      {updateProfileMutation.isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleProfileSubmit(onSubmitProfile)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      {...registerProfile('firstName', { required: 'Le prénom est requis' })}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 bg-gray-700 border ${
                        profileErrors.firstName ? 'border-red-500' : 'border-gray-600'
                      } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                        !isEditing ? 'bg-gray-800' : ''
                      }`}
                    />
                    {profileErrors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{profileErrors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      {...registerProfile('lastName', { required: 'Le nom est requis' })}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 bg-gray-700 border ${
                        profileErrors.lastName ? 'border-red-500' : 'border-gray-600'
                      } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                        !isEditing ? 'bg-gray-800' : ''
                      }`}
                    />
                    {profileErrors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{profileErrors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...registerProfile('email', {
                        required: 'L\'email est requis',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Adresse email invalide',
                        },
                      })}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 bg-gray-700 border ${
                        profileErrors.email ? 'border-red-500' : 'border-gray-600'
                      } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                        !isEditing ? 'bg-gray-800' : ''
                      }`}
                    />
                    {profileErrors.email && (
                      <p className="mt-1 text-sm text-red-500">{profileErrors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...registerProfile('phone')}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                        !isEditing ? 'bg-gray-800' : ''
                      }`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                      Adresse
                    </label>
                    <input
                      type="text"
                      id="address"
                      {...registerProfile('address')}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                        !isEditing ? 'bg-gray-800' : ''
                      }`}
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      id="city"
                      {...registerProfile('city')}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                        !isEditing ? 'bg-gray-800' : ''
                      }`}
                    />
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-1">
                      Code postal
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      {...registerProfile('postalCode')}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                        !isEditing ? 'bg-gray-800' : ''
                      }`}
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
                      Pays
                    </label>
                    <select
                      id="country"
                      {...registerProfile('country')}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                        !isEditing ? 'bg-gray-800' : ''
                      }`}
                    >
                      <option value="">Sélectionnez un pays</option>
                      <option value="FR">France</option>
                      <option value="BE">Belgique</option>
                      <option value="CH">Suisse</option>
                      <option value="CA">Canada</option>
                      {/* Ajoutez d'autres pays selon les besoins */}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-1">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      {...registerProfile('dateOfBirth')}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                        !isEditing ? 'bg-gray-800' : ''
                      }`}
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Onglet Sécurité */}
          {activeTab === 'security' && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">Sécurité du compte</h2>
              
              {!isChangingPassword ? (
                <div className="space-y-6">
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">Mot de passe</h3>
                        <p className="text-xs text-gray-400">Dernière modification il y a 3 mois</p>
                      </div>
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        Changer le mot de passe
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">Authentification à deux facteurs</h3>
                        <p className="text-xs text-gray-400">Non activée</p>
                      </div>
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors">
                        Activer
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">Sessions actives</h3>
                        <p className="text-xs text-gray-400">2 appareils connectés</p>
                      </div>
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors">
                        Voir les sessions
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900/50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">Changer le mot de passe</h3>
                  <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="space-y-4">
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

                    <div className="pt-2 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsChangingPassword(false);
                          resetPasswordForm();
                        }}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        Annuler
                      </button>
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
            </div>
          )}

          {/* Onglet Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">Préférences de notification</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-900/50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">Email</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">Notifications générales</h4>
                        <p className="text-xs text-gray-400">Actualités, mises à jour et offres spéciales</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div>
                        <h4 className="text-sm font-medium text-white">Notifications de sécurité</h4>
                        <p className="text-xs text-gray-400">Connexions suspectes et modifications de compte</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div>
                        <h4 className="text-sm font-medium text-white">Notifications de transaction</h4>
                        <p className="text-xs text-gray-400">Dépôts, retraits et gains</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">Notifications push</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">Activer les notifications push</h4>
                        <p className="text-xs text-gray-400">Recevez des notifications sur votre appareil</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors">
                    Enregistrer les préférences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Préférences */}
          {activeTab === 'preferences' && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">Préférences du compte</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-900/50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">Langue</h3>
                  <div className="max-w-md">
                    <select
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      defaultValue="fr"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">Devise</h3>
                  <div className="max-w-md">
                    <select
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      defaultValue="EUR"
                    >
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="GBP">British Pound (£)</option>
                      <option value="CHF">Swiss Franc (CHF)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">Fuseau horaire</h3>
                  <div className="max-w-md">
                    <select
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      defaultValue="Europe/Paris"
                    >
                      <option value="Europe/Paris">(GMT+1) Paris, Bruxelles</option>
                      <option value="Europe/London">(GMT+0) Londres</option>
                      <option value="America/New_York">(GMT-5) New York</option>
                      <option value="Asia/Tokyo">(GMT+9) Tokyo</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors">
                    Enregistrer les préférences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Activité */}
          {activeTab === 'activity' && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">Activité récente</h2>
              
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Activité
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        IP
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Localisation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {[
                      { id: 1, date: '2023-06-15 14:32:45', activity: 'Connexion réussie', status: 'Succès', ip: '192.168.1.1', location: 'Paris, France' },
                      { id: 2, date: '2023-06-15 10:15:22', activity: 'Tentative de connexion échouée', status: 'Échec', ip: '95.123.45.67', location: 'Lyon, France' },
                      { id: 3, date: '2023-06-14 18:45:10', activity: 'Changement de mot de passe', status: 'Succès', ip: '192.168.1.1', location: 'Paris, France' },
                      { id: 4, date: '2023-06-13 09:20:33', activity: 'Mise à jour du profil', status: 'Succès', ip: '192.168.1.1', location: 'Paris, France' },
                      { id: 5, date: '2023-06-12 16:55:18', activity: 'Connexion réussie', status: 'Succès', ip: '178.234.12.98', location: 'Bruxelles, Belgique' },
                    ].map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(activity.date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {activity.activity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            activity.status === 'Succès' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {activity.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {activity.ip}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {activity.location}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Affichage des 5 dernières activités sur 128
                </p>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors">
                  Voir tout l'historique
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
