import { Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';
import StyleDebugger from './components/debug/StyleDebugger';
import { useEffect } from 'react';

// Composant de chargement simplifié
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
    <p className="text-gray-400">Chargement en cours...</p>
  </div>
);

// Composant d'erreur
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <h1 className="text-2xl font-bold text-red-500 mb-4">Une erreur est survenue</h1>
    <pre className="bg-gray-800 p-4 rounded overflow-auto mb-4">
      {error.message}
    </pre>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Réessayer
    </button>
  </div>
);

// Composant pour la page d'erreur 403
const UnauthorizedPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Accès non autorisé</h1>
        <p>Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retour
        </button>
      </div>
    </div>
  );
};

// Composant principal de l'application
function App() {

  return (
    <div className="min-h-screen bg-black text-white">
      <StyleDebugger />
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#2D3748',
            color: '#fff',
            border: '1px solid #4A5568',
          },
        }}
      />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, errorInfo) => {
          console.error('Erreur non capturée:', error, errorInfo);
        }}
        onReset={() => window.location.reload()}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// Export des composants de route
export { default as HomePage } from './pages/HomePage';
export { default as LoginPage } from './pages/auth/LoginPage';
export { default as RegisterPage } from './pages/auth/RegisterPage';
export { default as VerifyEmailPage } from './pages/auth/VerifyEmailPage';
export { default as ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
export { default as ResetPasswordPage } from './pages/auth/ResetPasswordPage';
export { default as DepositPage } from './pages/transactions/DepositPage';
export { default as WithdrawPage } from './pages/transactions/WithdrawPage';
export { default as DashboardPage } from './pages/dashboard/DashboardPage';
export { default as ProfilePage } from './pages/profile/ProfilePage';
export { default as SettingsPage } from './pages/settings/SettingsPage';
export { default as NotFoundPage } from './pages/NotFoundPage';
// Autres pages disponibles
export { default as InvestmentPage } from './pages/investment/InvestmentPage';
export { default as NewInvestmentPage } from './pages/investment/NewInvestmentPage';
export { default as MyInvestmentsPage } from './pages/investment/MyInvestmentsPage';
export { default as ReferralPage } from './pages/referral/ReferralPage';
export { default as FAQPage } from './pages/faq/FAQPage';

export default App;