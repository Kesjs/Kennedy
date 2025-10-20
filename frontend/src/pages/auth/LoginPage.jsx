import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import Logo from '../../components/common/Logo';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Validation schema
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('L\'email est requis')
    .email('Veuillez entrer un email valide'),
  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [formError, setFormError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const { user, login, verify2FA, sendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleResendVerification = async () => {
    try {
      await sendVerificationEmail();
      toast.success('Un nouvel email de vérification a été envoyé !');
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast.error('Erreur lors de l\'envoi de l\'email de vérification');
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormFieldError,
    trigger,
    getValues
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange'
  });

  const onSubmit = async (formData) => {
    setFormError('');
    setUnverifiedEmail(null);
    setIsLoading(true);

    try {
      if (show2FA) {
        // Gestion de la vérification 2FA
        await verify2FA(formData.twoFactorCode, tempToken);
        return;
      }

      // Appel à la fonction de connexion
      const result = await login(formData.email, formData.password);
      
      // Vérifier si la connexion a échoué malgré l'absence d'exception
      if (result && !result.success) {
        throw new Error(result.error || 'Échec de la connexion');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Gestion des erreurs spécifiques
      const errorMessage = error.message || 'Une erreur est survenue';
      
      // Traduction et personnalisation des messages d'erreur
      if (errorMessage.includes('Invalid login credentials') || 
          errorMessage.includes('Invalid email or password') ||
          errorMessage.includes('Identifiants invalides')) {
        setFormError('Adresse email ou mot de passe incorrect. Veuillez réessayer.');
      } 
      else if (errorMessage.includes('Email not confirmed') || 
               errorMessage.includes('Email not verified')) {
        setUnverifiedEmail(formData.email);
        setFormError('Veuvez vérifier votre adresse email pour vous connecter.');
      } 
      else if (errorMessage.includes('trop de tentatives') || 
               errorMessage.includes('too many requests')) {
        setFormError('Trop de tentatives de connexion. Veuillez réessayer plus tard.');
      } 
      else if (errorMessage.includes('network') || 
               errorMessage.includes('fetch') || 
               errorMessage.includes('ECONNREFUSED')) {
        setFormError('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
      }
      else if (errorMessage.includes('User not found')) {
        setFormError('Aucun compte trouvé avec cette adresse email.');
      }
      else if (errorMessage.includes('incorrect password')) {
        setFormError('Mot de passe incorrect. Veuillez réessayer.');
      }
      else {
        // Message d'erreur générique pour les autres cas
        setFormError('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = handleSubmit(onSubmit);

  // Gestion de la redirection après connexion réussie
  useEffect(() => {
    if (user) {
      // Vérifier si l'utilisateur vient d'une page spécifique
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-6 left-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white">
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="text-sm">Retour à l'accueil</span>
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <Logo size="xl" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Connexion à votre compte
          </h2>
        </div>
        <p className="mt-2 text-center text-sm text-gray-400">
          Ou{' '}
          <Link
            to="/register"
            className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            créez un nouveau compte
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:rounded-2xl sm:px-10 border border-white/10 bg-white/5 backdrop-blur">
          <form className="space-y-6" onSubmit={handleFormSubmit}>
            {formError && (
              <div className="mb-4 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Erreur de connexion</p>
                  <p className="text-sm opacity-90">{formError}</p>
                </div>
              </div>
            )}
            <fieldset disabled={isLoading} className="space-y-6">
              {!show2FA ? (
                <>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Adresse email
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        disabled={isLoading}
                        {...register('email')}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          errors.email ? 'border-red-500' : 'border-gray-700 focus:border-purple-500'
                        } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Mot de passe
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        disabled={isLoading}
                        {...register('password')}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          errors.password ? 'border-red-500' : 'border-gray-700 focus:border-purple-500'
                        } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm`}
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.password.message}
                        </p>
                      )}
                      <div className="absolute right-0 top-0 pr-3 flex items-center h-full">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-300"
                          onClick={() => {
                            const passwordInput = document.getElementById('password');
                            if (passwordInput.type === 'password') {
                              passwordInput.type = 'text';
                            } else {
                              passwordInput.type = 'password';
                            }
                          }}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        disabled={isLoading}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-700"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-300"
                      >
                        Se souvenir de moi
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-4">
                  <label
                    htmlFor="twoFactorCode"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Code de vérification à 6 chiffres
                  </label>
                  <div className="mt-1">
                    <input
                      id="twoFactorCode"
                      name="twoFactorCode"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      autoComplete="one-time-code"
                      disabled={isLoading}
                      {...register('twoFactorCode', {
                        required: 'Le code de vérification est requis',
                        minLength: {
                          value: 6,
                          message: 'Le code doit contenir 6 chiffres',
                        },
                        maxLength: {
                          value: 6,
                          message: 'Le code doit contenir 6 chiffres',
                        },
                      })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-center tracking-widest"
                    />
                    {errors.twoFactorCode && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.twoFactorCode.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {unverifiedEmail && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-700 text-sm">
                    Vous n'avez pas encore vérifié votre adresse email.
                  </p>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isLoading}
                    className="mt-2 text-sm font-medium text-yellow-700 hover:text-yellow-600 focus:outline-none"
                  >
                    Renvoyer l'email de vérification
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {show2FA ? 'Vérification...' : 'Connexion...'}
                  </>
                ) : show2FA ? (
                  'Vérifier le code'
                ) : (
                  'Se connecter'
                )}
              </button>
            </fieldset>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Pas encore de compte ?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
