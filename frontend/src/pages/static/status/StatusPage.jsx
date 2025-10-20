import React, { useState, useEffect } from 'react';
import StaticContentPage from '../components/StaticContentPage';

const StatusPage = () => {
  const [status, setStatus] = useState({
    website: 'opérationnel',
    api: 'opérationnel',
    database: 'opérationnel',
    lastChecked: new Date().toLocaleString('fr-FR'),
    incidents: []
  });

  // Simuler la vérification de l'état des services
  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Ici, vous pourriez faire un appel API réel pour vérifier l'état des services
        // Pour l'instant, nous simulons une réponse
        setStatus(prev => ({
          ...prev,
          lastChecked: new Date().toLocaleString('fr-FR')
        }));
      } catch (error) {
        console.error('Erreur lors de la vérification du statut:', error);
      }
    };

    // Vérifier l'état immédiatement, puis toutes les 5 minutes
    checkStatus();
    const interval = setInterval(checkStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Fonction pour obtenir la classe de couleur en fonction du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'opérationnel':
        return 'bg-green-500';
      case 'dégradé':
        return 'bg-yellow-500';
      case 'indisponible':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <StaticContentPage 
      title="Statut des Services"
      lastUpdated={status.lastChecked}
    >
      <div className="space-y-8">
        <section>
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">État actuel des services</h2>
            <p className="text-gray-300 mb-6">
              Dernière vérification : {status.lastChecked}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h3 className="font-medium text-white">Site Web</h3>
                  <p className="text-sm text-gray-400">Accès à la plateforme Gazoduc Invest</p>
                </div>
                <div className="flex items-center">
                  <span className={`h-3 w-3 rounded-full ${getStatusColor(status.website)} mr-2`}></span>
                  <span className="text-sm font-medium">{status.website}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h3 className="font-medium text-white">API</h3>
                  <p className="text-sm text-gray-400">Services backend et traitement des données</p>
                </div>
                <div className="flex items-center">
                  <span className={`h-3 w-3 rounded-full ${getStatusColor(status.api)} mr-2`}></span>
                  <span className="text-sm font-medium">{status.api}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h3 className="font-medium text-white">Base de données</h3>
                  <p className="text-sm text-gray-400">Stockage et récupération des données</p>
                </div>
                <div className="flex items-center">
                  <span className={`h-3 w-3 rounded-full ${getStatusColor(status.database)} mr-2`}></span>
                  <span className="text-sm font-medium">{status.database}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Incidents récents</h2>
          {status.incidents.length > 0 ? (
            <div className="space-y-4">
              {status.incidents.map((incident, index) => (
                <div key={index} className="bg-red-900/30 border border-red-800 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-red-300">{incident.title}</h3>
                      <p className="text-sm text-red-200">{incident.description}</p>
                    </div>
                    <span className="text-xs text-red-300">{incident.date}</span>
                  </div>
                  {incident.updates && incident.updates.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-red-800">
                      <h4 className="text-sm font-medium text-red-200 mb-2">Mises à jour :</h4>
                      <div className="space-y-3">
                        {incident.updates.map((update, uIndex) => (
                          <div key={uIndex} className="text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium text-red-100">{update.status}</span>
                              <span className="text-xs text-red-300">{update.time}</span>
                            </div>
                            <p className="text-red-200">{update.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 text-center">
              <p className="text-green-300">Aucun incident récent à signaler.</p>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Historique des statuts</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">15 mars 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Site Web</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                      Opérationnel
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">Aucun problème détecté</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">14 mars 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">API</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-300">
                      Dégradé
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">Temps de réponse plus lent que la normale</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">10 mars 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Base de données</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900 text-red-300">
                      Indisponible
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">Maintenance planifiée</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white/5 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">S'abonner aux mises à jour</h2>
          <p className="text-gray-300 mb-4">
            Recevez des notifications par email concernant les interruptions de service et les maintenances planifiées.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
              S'abonner
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            En vous abonnant, vous acceptez de recevoir des emails concernant le statut des services.
            Vous pouvez vous désabonner à tout moment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Questions fréquentes</h2>
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-medium text-white">Comment sont signalés les problèmes ?</h3>
              <p className="text-gray-300 mt-1">
                Nous surveillons en permanence nos services et mettons à jour cette page dès qu'un problème est détecté. 
                Les utilisateurs abonnés reçoivent également des notifications par email.
              </p>
            </div>
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-medium text-white">Que faire en cas de problème ?</h3>
              <p className="text-gray-300 mt-1">
                Si vous rencontrez un problème, vérifiez d'abord cette page pour voir s'il s'agit d'une panne connue. 
                Si le problème persiste ou n'est pas répertorié, veuillez contacter notre équipe d'assistance.
              </p>
            </div>
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-medium text-white">Quand sont effectuées les maintenances ?</h3>
              <p className="text-gray-300 mt-1">
                Les maintenances planifiées sont généralement effectuées en dehors des heures de pointe, 
                et nous nous efforçons de les programmer à des moments qui affectent le moins d'utilisateurs possible.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center text-sm text-gray-500">
          <p>
            Cette page est mise à jour automatiquement toutes les 5 minutes. Dernière mise à jour : {status.lastChecked}
          </p>
          <p className="mt-2">
            Pour toute question, contactez notre équipe d'assistance à l'adresse 
            <a href="mailto:support@gazoduc-invest.com" className="text-primary-400 hover:underline ml-1">
              support@gazoduc-invest.com
            </a>
          </p>
        </section>
      </div>
    </StaticContentPage>
  );
};

export default StatusPage;
