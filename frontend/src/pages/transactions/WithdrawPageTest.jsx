import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import api from '../../services/api';

const WithdrawPageTest = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [isTestingAPI, setIsTestingAPI] = useState(false);

  const testAPIEndpoints = async () => {
    setIsTestingAPI(true);
    const results = {};

    // Test 1: Vérifier l'authentification
    results.auth = {
      user: !!user,
      isAuthenticated,
      loading: authLoading,
      token: !!localStorage.getItem('token')
    };

    // Test 2: Test de l'endpoint balance
    try {
      const balanceResponse = await api.get('/api/wallet/balance');
      results.balance = {
        success: true,
        data: balanceResponse.data,
        status: balanceResponse.status
      };
    } catch (error) {
      results.balance = {
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }

    // Test 3: Test de l'endpoint withdrawals
    try {
      const withdrawalsResponse = await api.get('/api/transactions/withdrawals');
      results.withdrawals = {
        success: true,
        data: withdrawalsResponse.data,
        status: withdrawalsResponse.status
      };
    } catch (error) {
      results.withdrawals = {
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }

    // Test 4: Test de l'endpoint withdrawal-addresses
    try {
      const addressesResponse = await api.get('/api/wallet/withdrawal-addresses');
      results.addresses = {
        success: true,
        data: addressesResponse.data,
        status: addressesResponse.status
      };
    } catch (error) {
      results.addresses = {
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }

    setTestResults(results);
    setIsTestingAPI(false);
  };

  useEffect(() => {
    if (user && isAuthenticated && !authLoading) {
      testAPIEndpoints();
    }
  }, [user, isAuthenticated, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Non authentifié</h2>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Test de la page de retrait</h1>
          
          <div className="mb-6">
            <button
              onClick={testAPIEndpoints}
              disabled={isTestingAPI}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isTestingAPI ? 'Test en cours...' : 'Relancer les tests'}
            </button>
          </div>

          <div className="space-y-4">
            {/* Test d'authentification */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">1. Authentification</h3>
              <div className="bg-gray-100 p-3 rounded text-sm">
                <pre>{JSON.stringify(testResults.auth, null, 2)}</pre>
              </div>
            </div>

            {/* Test balance */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">2. Endpoint /api/wallet/balance</h3>
              <div className={`p-3 rounded text-sm ${testResults.balance?.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <pre>{JSON.stringify(testResults.balance, null, 2)}</pre>
              </div>
            </div>

            {/* Test withdrawals */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">3. Endpoint /api/transactions/withdrawals</h3>
              <div className={`p-3 rounded text-sm ${testResults.withdrawals?.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <pre>{JSON.stringify(testResults.withdrawals, null, 2)}</pre>
              </div>
            </div>

            {/* Test addresses */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">4. Endpoint /api/wallet/withdrawal-addresses</h3>
              <div className={`p-3 rounded text-sm ${testResults.addresses?.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <pre>{JSON.stringify(testResults.addresses, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPageTest;
