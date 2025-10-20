import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import Logo from '../../components/common/Logo';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Validation schema
const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: yup
    .string()
    .required('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: yup
    .string()
    .required('L\'email est requis')
    .email('Veuillez entrer un email valide'),
  phone: yup
    .string()
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      'Veuillez entrer un numéro de téléphone valide avec l\'indicatif du pays'
    ),
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
  agreeTerms: yup
    .bool()
    .oneOf([true], 'Vous devez accepter les conditions d\'utilisation'),
  referralCode: yup.string(),
});

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const referralCode = searchParams.get('ref') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      referralCode: referralCode,
    },
  });

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);

    try {
      await registerUser({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone,
        password: data.password,
        referralCode: data.referralCode || null,
      });
      
      setSuccess(true);
      // Rediriger vers la page de vérification d'email
      navigate('/verify-email');
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Si l'inscription a réussi, afficher un message de succès
  if (success) {
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
              Inscription réussie !
            </h2>
          </div>
          <p className="mt-4 text-center text-gray-300">
            Un email de vérification a été envoyé à <span className="font-medium">{watch('email')}</span>.
            Veuillez vérifier votre boîte de réception et suivre les instructions pour activer votre compte.
          </p>
          <div className="mt-8">
            <Link
              to="/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Retour à la page de connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: 'Faible', color: 'bg-red-500' };
    
    let score = 0;
    // Length check
    if (password.length >= 8) score += 1;
    // Uppercase check
    if (/[A-Z]/.test(password)) score += 1;
    // Lowercase check
    if (/[a-z]/.test(password)) score += 1;
    // Number check
    if (/\d/.test(password)) score += 1;
    // Special char check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) score += 1;
    
    if (score <= 2) return { score, label: 'Faible', color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Moyen', color: 'bg-yellow-500' };
    if (score <= 4) return { score, label: 'Fort', color: 'bg-blue-500' };
    return { score, label: 'Très fort', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

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
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Déjà inscrit ?{' '}
            <Link
              to="/login"
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Connectez-vous ici
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="py-8 px-4 sm:rounded-2xl sm:px-10 border border-white/10 bg-white/5 backdrop-blur">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-300"
                >
                  Prénom
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    disabled={isLoading}
                    {...register('firstName')}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.firstName
                        ? 'border-red-500'
                        : 'border-gray-700 focus:border-purple-500'
                    } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-300"
                >
                  Nom
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    disabled={isLoading}
                    {...register('lastName')}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.lastName
                        ? 'border-red-500'
                        : 'border-gray-700 focus:border-purple-500'
                    } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

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
                    errors.email
                      ? 'border-red-500'
                      : 'border-gray-700 focus:border-purple-500'
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
                htmlFor="phone"
                className="block text-sm font-medium text-gray-300"
              >
                Téléphone (optionnel)
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  disabled={isLoading}
                  placeholder="+33 6 12 34 56 78"
                  {...register('phone')}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.phone
                      ? 'border-red-500'
                      : 'border-gray-700 focus:border-purple-500'
                  } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
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
                Confirmer le mot de passe
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

            {referralCode && (
              <div>
                <label
                  htmlFor="referralCode"
                  className="block text-sm font-medium text-gray-300"
                >
                  Code de parrainage
                </label>
                <div className="mt-1">
                  <input
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    disabled={isLoading || !!referralCode}
                    {...register('referralCode')}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                  {errors.referralCode && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.referralCode.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  disabled={isLoading}
                  {...register('agreeTerms')}
                  className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-700 rounded bg-gray-700"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="agreeTerms"
                  className="font-medium text-gray-300"
                >
                  J'accepte les{' '}
                  <Link
                    to="/terms"
                    className="text-purple-400 hover:text-purple-300"
                    target="_blank"
                  >
                    conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link
                    to="/privacy"
                    className="text-purple-400 hover:text-purple-300"
                    target="_blank"
                  >
                    politique de confidentialité
                  </Link>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.agreeTerms.message}
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
                    Création du compte...
                  </>
                ) : (
                  'Créer un compte'
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
                  Déjà un compte ?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
