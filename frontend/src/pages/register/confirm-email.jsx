import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';
import Link from 'next/link';

export default function ConfirmEmail() {
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { email } = router.query;

  const resendVerification = async () => {
    setResending(true);
    setMessage('');
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email || '',
      });

      if (error) throw error;
      
      setMessage('Un nouvel email de vérification a été envoyé.');
    } catch (error) {
      setMessage("Erreur lors de l'envoi du nouvel email. Veuillez réessayer.");
      console.error('Resend error:', error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-3 text-lg font-medium text-gray-900">Vérifiez votre email</h2>
          <p className="mt-2 text-sm text-gray-500">
            Nous avons envoyé un lien de vérification à votre adresse email.
            Veuillez cliquer sur ce lien pour activer votre compte.
          </p>
          
          {message && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded text-sm">
              {message}
            </div>
          )}
          
          <div className="mt-6 space-y-4">
            <button
              onClick={resendVerification}
              disabled={resending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {resending ? 'Envoi en cours...' : "Renvoyer l'email de vérification"}
            </button>
            
            <div className="text-sm text-center">
              <Link href="/login">
                <a className="font-medium text-blue-600 hover:text-blue-500">
                  Retour à la page de connexion
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
