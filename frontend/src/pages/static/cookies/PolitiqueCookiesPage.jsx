import React, { useState, useEffect } from 'react';
import StaticContentPage from '../components/StaticContentPage';

const PolitiqueCookiesPage = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  const [showBanner, setShowBanner] = useState(false);

  // Load saved preferences on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('cookiePreferences');
    if (savedPreferences) {
      setCookiePreferences(JSON.parse(savedPreferences));
    } else {
      setShowBanner(true);
    }
  }, []);

  const handlePreferenceChange = (type) => {
    const newPreferences = {
      ...cookiePreferences,
      [type]: !cookiePreferences[type]
    };
    setCookiePreferences(newPreferences);
  };

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    setShowBanner(false);
    // Here you would typically also set/remove the actual cookies based on preferences
  };

  const acceptAllCookies = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setCookiePreferences(allAccepted);
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    setShowBanner(false);
    // Here you would typically set all cookies
  };

  const rejectAllCookies = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setCookiePreferences(onlyNecessary);
    localStorage.setItem('cookiePreferences', JSON.stringify(onlyNecessary));
    setShowBanner(false);
    // Here you would typically remove all non-necessary cookies
  };

  const cookieTypes = [
    {
      id: 'necessary',
      title: 'Cookies nécessaires',
      description: 'Ces cookies sont essentiels pour le bon fonctionnement du site et ne peuvent pas être désactivés. Ils sont généralement activés en réponse à des actions que vous effectuez, comme vous connecter à votre compte ou remplir des formulaires.',
      alwaysOn: true
    },
    {
      id: 'preferences',
      title: 'Préférences',
      description: 'Ces cookies permettent au site de se souvenir des choix que vous faites (comme votre nom d\'utilisateur, la langue ou la région où vous vous trouvez) et de fournir des fonctionnalités améliorées et plus personnelles.'
    },
    {
      id: 'analytics',
      title: 'Analytiques',
      description: 'Ces cookies nous permettent de compter les visites et les sources de trafic, afin que nous puissions mesurer et améliorer les performances de notre site. Ils nous aident à savoir quelles pages sont les plus et le moins populaires et à voir comment les visiteurs se déplacent sur le site.'
    },
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Ces cookies peuvent être définis par nos partenaires publicitaires. Ils peuvent être utilisés par ces entreprises pour établir un profil de vos intérêts et vous montrer des publicités pertinentes sur d\'autres sites.'
    }
  ];

  return (
    <StaticContentPage 
      title="Politique relative aux Cookies"
      lastUpdated="15 mars 2024"
    >
      <div className="space-y-8">
        <section>
          <p className="text-gray-300 mb-6">
            Cette politique relative aux cookies explique ce que sont les cookies, comment nous les utilisons, comment nos partenaires tiers peuvent les utiliser via notre site, et comment vous pouvez gérer vos préférences en matière de cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Que sont les cookies ?</h2>
          <p className="text-gray-300 mb-4">
            Les cookies sont de petits fichiers texte qui sont stockés sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. Ils sont largement utilisés pour faire fonctionner les sites web ou les faire fonctionner plus efficacement, ainsi que pour fournir des informations aux propriétaires du site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">2. Comment utilisons-nous les cookies ?</h2>
          <p className="text-gray-300 mb-4">
            Nous utilisons des cookies pour plusieurs raisons :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
            <li>Pour faire fonctionner correctement notre site web</li>
            <li>Pour vous fournir une expérience personnalisée</li>
            <li>Pour comprendre comment les visiteurs utilisent notre site</li>
            <li>Pour améliorer nos services</li>
            <li>Pour afficher des publicités pertinentes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">3. Types de cookies que nous utilisons</h2>
          <div className="space-y-6">
            {cookieTypes.map((cookie) => (
              <div key={cookie.id} className="bg-white/5 p-6 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">{cookie.title}</h3>
                    <p className="text-gray-300 text-sm">{cookie.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={cookie.alwaysOn || cookiePreferences[cookie.id]}
                      onChange={() => handlePreferenceChange(cookie.id)}
                      disabled={cookie.alwaysOn}
                    />
                    <div className={`w-11 h-6 ${cookie.alwaysOn ? 'bg-blue-600' : 'bg-gray-700'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${cookie.alwaysOn ? 'peer-checked:bg-blue-600' : 'peer-checked:bg-primary-600'}`}>
                    </div>
                  </label>
                </div>
                {cookie.alwaysOn && (
                  <p className="text-xs text-gray-400 mt-2">Toujours actif - Ces cookies sont nécessaires au bon fonctionnement du site.</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">4. Cookies tiers</h2>
          <p className="text-gray-300 mb-4">
            Certains contenus ou applications, y compris les publicités, sur le site sont servis par des tiers, y compris des annonceurs, des réseaux publicitaires, des serveurs, des fournisseurs d'analyse et des fournisseurs d'applications. Ces tiers peuvent utiliser des cookies seuls ou en combinaison avec des balises Web ou d'autres technologies de suivi pour recueillir des informations sur vous lorsque vous utilisez notre site.
          </p>
          <p className="text-gray-300">
            Nous n'avons aucun contrôle sur ces cookies tiers. Pour plus d'informations sur la façon dont ces tiers utilisent vos informations, veuillez consulter leur politique de confidentialité respective.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Comment gérer les cookies</h2>
          <p className="text-gray-300 mb-4">
            Vous pouvez configurer votre navigateur pour qu'il refuse tous les cookies ou pour qu'il vous avertisse lorsqu'un cookie est envoyé. Cependant, si vous ne sélectionnez pas ces paramètres, ou si vous les refusez, certaines fonctionnalités du site pourraient ne pas fonctionner correctement.
          </p>
          <p className="text-gray-300 mb-4">
            Voici comment gérer les cookies dans les principaux navigateurs :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/fr-fr/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Safari</a></li>
            <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Microsoft Edge</a></li>
          </ul>
          <p className="text-gray-300">
            Pour plus d'informations sur la gestion des cookies, visitez <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">aboutcookies.org</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">6. Vos préférences en matière de cookies</h2>
          <p className="text-gray-300 mb-4">
            Vous pouvez mettre à jour vos préférences en matière de cookies à tout moment en utilisant le bouton ci-dessous :
          </p>
          <button 
            onClick={() => setShowBanner(true)}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Gérer les préférences de cookies
          </button>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">7. Modifications de notre politique relative aux cookies</h2>
          <p className="text-gray-300">
            Nous pouvons mettre à jour notre politique relative aux cookies de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle politique sur cette page et en mettant à jour la date de "Dernière mise à jour" en haut de cette politique.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">8. Nous contacter</h2>
          <p className="text-gray-300">
            Si vous avez des questions sur cette politique relative aux cookies, vous pouvez nous contacter à l'adresse suivante : <a href="mailto:privacy@gazoduc-invest.com" className="text-primary-400 hover:underline">privacy@gazoduc-invest.com</a>
          </p>
        </section>
      </div>

      {/* Cookie Consent Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg z-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-medium mb-2">Préférences en matière de cookies</h3>
                <p className="text-sm text-gray-300">
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site. Certains cookies sont nécessaires au bon fonctionnement du site, tandis que d'autres nous aident à comprendre comment vous interagissez avec nous. Pour en savoir plus, consultez notre <a href="/cookies" className="text-primary-400 hover:underline">Politique relative aux cookies</a>.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button 
                  onClick={savePreferences}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Enregistrer les préférences
                </button>
                <button 
                  onClick={acceptAllCookies}
                  className="px-4 py-2 bg-white text-gray-900 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Tout accepter
                </button>
                <button 
                  onClick={rejectAllCookies}
                  className="px-4 py-2 border border-gray-600 text-white hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Tout refuser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StaticContentPage>
  );
};

export default PolitiqueCookiesPage;
