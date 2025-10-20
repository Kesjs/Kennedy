import { createBrowserRouter, Navigate } from 'react-router-dom';
import App, {
  HomePage,
  LoginPage,
  RegisterPage,
  VerifyEmailPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  DashboardPage,
  InvestmentPage,
  DepositPage,
  WithdrawPage,
  SettingsPage,
  NotFoundPage
} from '../App';

// Import des pages statiques
import AboutPage from '../pages/static/about';
import TeamPage from '../pages/static/team';
import CareersPage from '../pages/static/careers';
import HelpPage from '../pages/static/help';
import ContactPage from '../pages/static/contact';
import MentionsLegalesPage from '../pages/static/legal';
import PolitiqueConfidentialitePage from '../pages/static/privacy';
import PolitiqueCookiesPage from '../pages/static/cookies';

import UnauthorizedPage from '../components/common/UnauthorizedPage';
import Layout from '../components/layout/Layout';
import PrivateRoute from '../components/routes/PrivateRoute';
import AdminRoute from '../components/routes/AdminRoute';

// Configuration des routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Routes publiques
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/verify-email", element: <VerifyEmailPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
      { path: "/unauthorized", element: <UnauthorizedPage /> },
      
      // Pages statiques
      { path: "/a-propos", element: <AboutPage /> },
      { path: "/equipe", element: <TeamPage /> },
      { path: "/carrieres", element: <CareersPage /> },
      { path: "/aide", element: <HelpPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/mentions-legales", element: <MentionsLegalesPage /> },
      { path: "/confidentialite", element: <PolitiqueConfidentialitePage /> },
      { path: "/cookies", element: <PolitiqueCookiesPage /> },
      { path: "/conditions", element: <div className="min-h-screen p-8"><h1>Conditions Générales d'Utilisation</h1></div> },
      { path: "/statut", element: <div className="min-h-screen p-8"><h1>Statut du Service</h1></div> },
      { path: "/assistance", element: <div className="min-h-screen p-8"><h1>Assistance 24/7</h1></div> },
      
      // Routes protégées
      {
        path: "/",
        element: (
          <PrivateRoute requireEmailVerification={true}>
            <Layout />
          </PrivateRoute>
        ),
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/invest", element: <InvestmentPage /> },
          { path: "/deposit", element: <DepositPage /> },
          { path: "/withdraw", element: <WithdrawPage /> },
          { path: "/settings", element: <SettingsPage /> },
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
          { path: "*", element: <div>Admin Panel</div> },
        ],
      },
      
      // 404 - Doit être la dernière route
      { path: "*", element: <NotFoundPage /> },
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

export { router };
