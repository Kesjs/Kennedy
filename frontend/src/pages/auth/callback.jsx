import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

export default function Callback() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Récupérer la session actuelle
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session) {
          // Si une session existe, rediriger vers le tableau de bord
          router.push('/dashboard');
          return;
        }

        // Vérifier les paramètres d'URL pour les différents types d'authentification
        const { token_hash, type } = router.query;

        if (token_hash && type) {
          // Gérer la vérification d'email et la réinitialisation de mot de passe
          const { error: authError } = await supabase.auth.verifyOtp({
            token_hash,
            type,
          });

          if (authError) throw authError;

          // Rediriger en fonction du type d'opération
          if (type === 'signup') {
            router.push('/login?verified=true');
          } else if (type === 'recovery') {
            router.push('/reset-password');
          } else {
            router.push('/login');
          }
        } else {
          // Si aucun token ni type n'est fourni, essayer de récupérer la session
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) throw userError;
          
          if (user) {
            router.push('/dashboard');
          } else {
            throw new Error('Aucune session valide trouvée');
          }
        }
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        setError(error.message || 'Une erreur est survenue lors de l\'authentification');
        // Rediriger vers la page de connexion avec un message d'erreur
        router.push(`/login?error=${encodeURIComponent(error.message || 'auth_error')}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (router.isReady) {
      handleAuthCallback();
    }
  }, [router, router.isReady]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Vérification en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur d'authentification</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return null;
}
