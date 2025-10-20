import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AuthError() {
  const { query } = useRouter();
  const { error } = query;

  const errorMessages = {
    verification_failed: 'Le lien de vérification est invalide ou a expiré.',
    invalid_token: 'Le lien de vérification est incomplet ou incorrect.',
    default: 'Une erreur est survenue lors de la vérification.'
  };

  const message = errorMessages[error] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="mt-3 text-lg font-medium text-gray-900">Erreur de vérification</h2>
          <p className="mt-2 text-sm text-gray-500">{message}</p>
        </div>
        <div className="mt-6">
          <Link href="/login">
            <a className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Retour à la page de connexion
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
