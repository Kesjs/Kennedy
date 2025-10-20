import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from './App';
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import Layout from './components/layout/Layout';

// Importations dynamiques avec chargement paresseux
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const DepositPage = lazy(() => import('./pages/deposit/NewDepositPage'));
const WithdrawPage = lazy(() => import('./pages/transactions/WithdrawPage'));
const WithdrawPageTest = lazy(() => import('./pages/transactions/WithdrawPageTest'));
const TransactionHistoryPage = lazy(() => import('./pages/transactions/TransactionHistoryPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'));
const InvestmentPage = lazy(() => import('./pages/investment/InvestmentPage'));
const NewInvestmentPage = lazy(() => import('./pages/investment/NewInvestmentPage'));
const MyInvestmentsPage = lazy(() => import('./pages/investment/MyInvestmentsPage'));
const ReferralPage = lazy(() => import('./pages/referral/ReferralWrapper'));
const FAQPage = lazy(() => import('./pages/faq/FAQPage'));
const SupportPage = lazy(() => import('./pages/support/SupportPage'));
const DocumentsPage = lazy(() => import('./pages/documents/DocumentsPage'));
const AboutPage = lazy(() => import('./pages/static/about/AboutPage'));
const ContactPage = lazy(() => import('./pages/static/contact/ContactPage'));
const ConditionsGeneralesPage = lazy(() => import('./pages/static/terms/ConditionsGeneralesPage'));
const PolitiqueConfidentialitePage = lazy(() => import('./pages/static/privacy/PolitiqueConfidentialitePage'));
const MentionsLegalesPage = lazy(() => import('./pages/static/legal/MentionsLegalesPage'));
const PolitiqueCookiesPage = lazy(() => import('./pages/static/cookies/PolitiqueCookiesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Composant de chargement pour le suspense
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

// Configuration des routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Routes publiques
      {
        path: '/',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: '/verify-email',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <VerifyEmailPage />
          </Suspense>
        ),
      },
      {
        path: '/forgot-password',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ForgotPasswordPage />
          </Suspense>
        ),
      },
      {
        path: '/reset-password',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ResetPasswordPage />
          </Suspense>
        ),
      },
      
      // Routes protégées avec Layout
      {
        path: '/dashboard',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <DashboardPage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/deposit',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <DepositPage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/withdraw',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <WithdrawPage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/withdraw-test',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <WithdrawPageTest />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/transactions',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <TransactionHistoryPage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <ProfilePage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/settings',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <SettingsPage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/invest',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <InvestmentPage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/invest/new',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <NewInvestmentPage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/invest/list',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <MyInvestmentsPage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/referral',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <ReferralPage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/referral/link',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <ReferralPage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/referral/referrals',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <ReferralPage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/referral/commissions',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <ReferralPage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/faq',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <SupportPage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/support',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <SupportPage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      {
        path: '/documents',
        element: (
          <PrivateRoute>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <DocumentsPage />
              </Suspense>
            </Layout>
          </PrivateRoute>
        ),
      },
      
      // Pages statiques (publiques)
      {
        path: '/a-propos',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: '/contact',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: '/conditions',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ConditionsGeneralesPage />
          </Suspense>
        ),
      },
      {
        path: '/confidentialite',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PolitiqueConfidentialitePage />
          </Suspense>
        ),
      },
      {
        path: '/mentions-legales',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MentionsLegalesPage />
          </Suspense>
        ),
      },
      {
        path: '/cookies',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PolitiqueCookiesPage />
          </Suspense>
        ),
      },
      
      // Redirections
      {
        path: '/home',
        element: <Navigate to="/" replace />,
      },
      
      // 404 - Doit être la dernière route
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

// Exporter le routeur comme une exportation nommée
export { router };
