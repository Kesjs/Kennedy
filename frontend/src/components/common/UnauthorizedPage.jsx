import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Accès non autorisé</h1>
        <p className="text-gray-300 mb-6">
          Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
          Veuillez vous connecter avec un compte ayant les droits d'accès appropriés.
        </p>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Page précédente
          </button>
          <button 
            onClick={() => navigate('/login')} 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Page de connexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
