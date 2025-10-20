import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import api from '../../services/api';
import {
  FiFileText,
  FiDownload,
  FiEye,
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiFolder,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiAlertCircle
} from 'react-icons/fi';

const DocumentsPage = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Gérer les paramètres d'URL pour les filtres
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const typeParam = urlParams.get('type');
    if (typeParam && ['contract', 'invoice', 'report'].includes(typeParam)) {
      setActiveTab(typeParam);
      setFilterType(typeParam);
    }
  }, [location.search]);

  // Vérification de l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Accès restreint</h2>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à vos documents.</p>
        </div>
      </div>
    );
  }

  // Récupérer les documents
  const { data: documents = [], isLoading, error } = useQuery({
    queryKey: ['userDocuments'],
    queryFn: async () => {
      const response = await api.get('/api/documents');
      return response.data;
    },
    enabled: !!user && !!isAuthenticated,
    retry: 2,
    onError: (error) => {
      console.error('Error fetching documents:', error);
    },
  });

  // Données de démonstration si l'API n'est pas disponible
  const defaultDocuments = [
    {
      id: 1,
      name: 'Contrat d\'investissement - Projet Gazoduc Nord',
      type: 'contract',
      date: '2024-01-15',
      size: '2.4 MB',
      status: 'signed',
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'Facture - Investissement Janvier 2024',
      type: 'invoice',
      date: '2024-01-20',
      size: '156 KB',
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 3,
      name: 'Rapport de performance - Q1 2024',
      type: 'report',
      date: '2024-03-31',
      size: '1.8 MB',
      status: 'available',
      downloadUrl: '#'
    },
    {
      id: 4,
      name: 'Contrat d\'investissement - Projet Gazoduc Sud',
      type: 'contract',
      date: '2024-02-10',
      size: '2.1 MB',
      status: 'pending',
      downloadUrl: '#'
    },
    {
      id: 5,
      name: 'Facture - Investissement Février 2024',
      type: 'invoice',
      date: '2024-02-25',
      size: '142 KB',
      status: 'paid',
      downloadUrl: '#'
    }
  ];

  const displayDocuments = error ? defaultDocuments : documents;

  // Filtrer les documents
  const filteredDocuments = displayDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    const matchesTab = activeTab === 'all' || doc.type === activeTab;
    return matchesSearch && matchesFilter && matchesTab;
  });

  const tabs = [
    { id: 'all', name: 'Tous les documents', icon: FiFolder },
    { id: 'contract', name: 'Contrats', icon: FiFileText },
    { id: 'invoice', name: 'Factures', icon: FiDollarSign },
    { id: 'report', name: 'Rapports', icon: FiEye },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'signed':
      case 'paid':
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'signed':
        return 'Signé';
      case 'paid':
        return 'Payé';
      case 'available':
        return 'Disponible';
      case 'pending':
        return 'En attente';
      case 'expired':
        return 'Expiré';
      default:
        return 'Inconnu';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'contract':
        return <FiFileText className="h-5 w-5" />;
      case 'invoice':
        return <FiDollarSign className="h-5 w-5" />;
      case 'report':
        return <FiEye className="h-5 w-5" />;
      default:
        return <FiFileText className="h-5 w-5" />;
    }
  };

  const handleDownload = (document) => {
    // Simulation du téléchargement
    console.log('Téléchargement du document:', document.name);
    // Dans un vrai projet, cela ferait un appel API pour télécharger le fichier
  };

  const handleView = (document) => {
    // Simulation de la visualisation
    console.log('Visualisation du document:', document.name);
    // Dans un vrai projet, cela ouvrirait le document dans un viewer
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de vos documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto p-0 m-0 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Mes documents</h1>
          <p className="mt-1 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Accédez à tous vos contrats, factures et rapports
          </p>
        </div>

        {/* Affichage des erreurs d'API */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Mode démonstration
              </h3>
            </div>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>Les documents affichés sont des exemples. Connectez-vous à l'API pour voir vos vrais documents.</p>
            </div>
          </div>
        )}

        {/* Barre de recherche et filtres */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="contract">Contrats</option>
              <option value="invoice">Factures</option>
              <option value="report">Rapports</option>
            </select>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <FiRefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Liste des documents */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {filteredDocuments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Taille
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDocuments.map((document) => (
                    <tr key={document.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                            {getTypeIcon(document.type)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {document.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {document.type === 'contract' ? 'Contrat' : 
                           document.type === 'invoice' ? 'Facture' : 
                           document.type === 'report' ? 'Rapport' : 'Document'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <FiCalendar className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(document.date).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {document.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(document.status)}`}>
                          {getStatusText(document.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(document)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                          >
                            <FiEye className="h-4 w-4 mr-1" />
                            Voir
                          </button>
                          <button
                            onClick={() => handleDownload(document)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 flex items-center"
                          >
                            <FiDownload className="h-4 w-4 mr-1" />
                            Télécharger
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <FiFolder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun document trouvé</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || filterType !== 'all' 
                  ? 'Aucun document ne correspond à vos critères de recherche.'
                  : 'Vous n\'avez pas encore de documents. Ils apparaîtront ici après vos premiers investissements.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Statistiques */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <FiFileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total documents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayDocuments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <FiFileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contrats</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {displayDocuments.filter(d => d.type === 'contract').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <FiDollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Factures</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {displayDocuments.filter(d => d.type === 'invoice').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                <FiEye className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rapports</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {displayDocuments.filter(d => d.type === 'report').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
