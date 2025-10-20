import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import PrivateRoute from './PrivateRoute';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Vérifie si l'utilisateur est connecté et a le rôle admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
