import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import { lazy, Suspense } from 'react';

// Importations dynamiques avec chargement paresseux
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const VerifyEmailPage = lazy(() => import('../pages/auth/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const InvestmentPage = lazy(() => import('../pages/investment/InvestmentPage'));
const NewInvestmentPage = lazy(() => import('../pages/investment/NewInvestmentPage'));
const MyInvestmentsPage = lazy(() => import('../pages/investment/MyInvestmentsPage'));
const DepositPage = lazy(() => import('../pages/deposit/NewDepositPage'));
const WithdrawPage = lazy(() => import('../pages/transactions/WithdrawPage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Import des pages statiques
import {
  AboutPage,
  TeamPage,
  CareersPage,
  HelpPage,
  ContactPage,
  MentionsLegalesPage,
  PolitiqueConfidentialitePage,
  PolitiqueCookiesPage,
  ConditionsGeneralesPage,
  StatusPage,
  AssistancePage
} from '../pages/static';

import UnauthorizedPage from '../components/common/UnauthorizedPage';
import Layout from '../components/layout/Layout';
import PrivateRoute from '../components/routes/PrivateRoute';
import AdminRoute from '../components/routes/AdminRoute';

// Composant de chargement
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
  </div>
);

// Composant pour envelopper les composants chargés de manière paresseuse
const LazyComponent = ({ component: Component }) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

// Configuration des routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Routes publiques
      { 
        path: "/", 
        element: <LazyComponent component={HomePage} /> 
      },
      { 
        path: "/login", 
        element: <LazyComponent component={LoginPage} /> 
      },
      { 
        path: "/register", 
        element: <LazyComponent component={RegisterPage} /> 
      },
      { 
        path: "/verify-email", 
        element: <LazyComponent component={VerifyEmailPage} /> 
      },
      { 
        path: "/forgot-password", 
        element: <LazyComponent component={ForgotPasswordPage} /> 
      },
      { 
        path: "/reset-password", 
        element: <LazyComponent component={ResetPasswordPage} /> 
      },
      { 
        path: "/unauthorized", 
        element: <UnauthorizedPage /> 
      },
      
      // Pages statiques
      { 
        path: "/a-propos", 
        element: <div className="p-8 bg-white text-black min-h-screen"><h1 className="text-2xl font-bold">Test - Page À propos</h1><p>Cette page fonctionne !</p></div>
      },
      { 
        path: "/equipe", 
        element: <TeamPage /> 
      },
      { 
        path: "/carrieres", 
        element: <CareersPage /> 
      },
      { 
        path: "/aide", 
        element: <HelpPage /> 
      },
      { 
        path: "/contact", 
        element: <ContactPage /> 
      },
      { 
        path: "/mentions-legales", 
        element: <MentionsLegalesPage /> 
      },
      { 
        path: "/confidentialite", 
        element: <PolitiqueConfidentialitePage /> 
      },
      { 
        path: "/cookies", 
        element: <PolitiqueCookiesPage /> 
      },
      { 
        path: "/conditions", 
        element: <ConditionsGeneralesPage /> 
      },
      { 
        path: "/statut", 
        element: <StatusPage /> 
      },
      { 
        path: "/assistance", 
        element: <AssistancePage /> 
      },
      
      // Routes protégées
      {
        path: "/dashboard",
        element: (
          <PrivateRoute requireEmailVerification={true}>
            <Layout />
          </PrivateRoute>
        ),
        children: [
          { 
            index: true, 
            element: <LazyComponent component={DashboardPage} /> 
          },
          { 
            path: "invest", 
            children: [
              {
                index: true,
                element: <LazyComponent component={InvestmentPage} />
              },
              {
                path: "new",
                element: <LazyComponent component={NewInvestmentPage} />
              },
              {
                path: "list",
                element: <LazyComponent component={MyInvestmentsPage} />
              }
            ]
          },
          { 
            path: "wallet", 
            element: <div>Page Portefeuille</div>
          },
          { 
            path: "deposit", 
            element: <LazyComponent component={DepositPage} /> 
          },
          { 
            path: "withdraw", 
            element: <LazyComponent component={WithdrawPage} /> 
          },
          { 
            path: "transactions", 
            element: <div>Page Historique des transactions</div>
          },
          { 
            path: "settings", 
            element: <LazyComponent component={SettingsPage} /> 
          },
        ],
      },
      
      // Routes admin
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <Layout />
          </AdminRoute>
        ),
        children: [
          { 
            path: "*", 
            element: <div>Admin Panel</div> 
          },
        ],
      },
    ],
  },
  
  // 404 - Doit être la dernière route
  { 
    path: "*", 
    element: <LazyComponent component={NotFoundPage} /> 
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

export { router };
