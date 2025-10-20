import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/common/Logo';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Validation schema
const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).*$/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
    .required('La confirmation du mot de passe est requise'),
});

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [searchParams] = useSearchParams();
  const { resetPasswordWithToken } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const password = watch('password', '');

  useEffect(() => {
    // Récupérer le token et l'email depuis l'URL
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');

    if (!urlToken || !urlEmail) {
      setError('Lien de réinitialisation invalide ou expiré');
      return;
    }

    setToken(urlToken);
    setEmail(urlEmail);
  }, [searchParams]);

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: 'Faible', color: 'bg-red-500' };
    
    let score = 0;
    // Vérification de la longueur
    if (password.length >= 8) score += 1;
    // Vérification des majuscules
    if (/[A-Z]/.test(password)) score += 1;
    // Vérification des minuscules
    if (/[a-z]/.test(password)) score += 1;
    // Vérification des chiffres
    if (/\d/.test(password)) score += 1;
    // Vérification des caractères spéciaux
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) score += 1;
    
    if (score <= 2) return { score, label: 'Faible', color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Moyen', color: 'bg-yellow-500' };
    if (score <= 4) return { score, label: 'Fort', color: 'bg-blue-500' };
    return { score, label: 'Très fort', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    if (!token || !email) {
      setError('Lien de réinitialisation invalide ou expiré');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await resetPasswordWithToken(token, email, data.password);
      setIsSuccess(true);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(
        err.response?.data?.message ||
          'Une erreur est survenue lors de la réinitialisation du mot de passe. Veuillez réessayer ou demander un nouveau lien.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="absolute top-6 left-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="text-sm">Retour à l'accueil</span>
          </Link>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Logo className="h-16 w-auto" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Mot de passe réinitialisé avec succès
          </h2>
          <div className="mt-8 py-8 px-4 sm:rounded-2xl sm:px-10 border border-green-500/30 bg-white/5 backdrop-blur">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-white">
                Mot de passe mis à jour
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Se connecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="absolute top-6 left-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="text-sm">Retour à l'accueil</span>
          </Link>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Logo className="h-16 w-auto" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Lien invalide ou expiré
          </h2>
          <div className="mt-8 bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-red-500/30">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-white">
                Oups, quelque chose s'est mal passé
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                {error || 'Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien de réinitialisation.'}
              </p>
              <div className="mt-6">
                <Link
                  to="/forgot-password"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Demander un nouveau lien
                </Link>
              </div>
              <div className="mt-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-purple-400 hover:text-purple-300"
                >
                  Retour à la page de connexion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo className="h-16 w-auto" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Réinitialiser votre mot de passe
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Entrez votre nouveau mot de passe pour {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:rounded-2xl sm:px-10 border border-white/10 bg-white/5 backdrop-blur">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Nouveau mot de passe
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register('password')}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password
                      ? 'border-red-500'
                      : 'border-gray-700 focus:border-purple-500'
                  } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm`}
                />
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
              {errors.password ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              ) : (
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Force du mot de passe: {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300"
              >
                Confirmer le nouveau mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register('confirmPassword')}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.confirmPassword
                      ? 'border-red-500'
                      : 'border-gray-700 focus:border-purple-500'
                  } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div>
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
                    Réinitialisation en cours...
                  </>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Vous n'avez pas de compte ?
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
};

export { ResetPasswordPage };
export default ResetPasswordPage;
