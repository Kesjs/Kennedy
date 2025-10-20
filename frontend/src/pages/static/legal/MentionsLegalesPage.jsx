import React from 'react';
import StaticContentPage from '../components/StaticContentPage';

const MentionsLegalesPage = () => {
  return (
    <StaticContentPage 
      title="Mentions Légales"
      lastUpdated="15 mars 2024"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Éditeur du site</h2>
          <p className="text-gray-300 mb-4">
            Le site web gazoduc-invest.com est édité par :
          </p>
          <div className="bg-white/5 p-6 rounded-lg">
            <p className="font-medium">Gazoduc Invest SAS</p>
            <p>123 Rue de l'Innovation</p>
            <p>75001 Paris, France</p>
            <p>RCS Paris 123 456 789</p>
            <p>N° TVA intracommunautaire : FR 12 345678912</p>
            <p>Email : contact@gazoduc-invest.com</p>
            <p>Téléphone : +33 1 23 45 67 89</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">2. Directeur de la publication</h2>
          <p className="text-gray-300">
            Le directeur de la publication est Jean Dupont, en qualité de Président de Gazoduc Invest SAS.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">3. Hébergement</h2>
          <p className="text-gray-300 mb-2">
            Le site est hébergé par :
          </p>
          <div className="bg-white/5 p-6 rounded-lg">
            <p className="font-medium">Vercel Inc.</p>
            <p>340 S Lemon Ave #4133</p>
            <p>Walnut, CA 91789</p>
            <p>États-Unis</p>
            <p>Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">vercel.com</a></p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">4. Propriété intellectuelle</h2>
          <p className="text-gray-300 mb-4">
            L'ensemble des éléments constituant le site (textes, images, logos, vidéos, sons, architecture, etc.) sont la propriété exclusive de Gazoduc Invest ou de ses partenaires. Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, de tout ou partie des éléments du site sans l'accord écrit préalable de Gazoduc Invest est strictement interdite et constituerait un acte de contrefaçon sanctionné par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Données personnelles</h2>
          <p className="text-gray-300 mb-4">
            Les informations concernant la collecte et le traitement des données personnelles sont détaillées dans notre <a href="/confidentialite" className="text-primary-400 hover:underline">Politique de Confidentialité</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies</h2>
          <p className="text-gray-300 mb-4">
            Le site utilise des cookies pour améliorer votre expérience de navigation. Pour en savoir plus, consultez notre <a href="/cookies" className="text-primary-400 hover:underline">Politique relative aux Cookies</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">7. Droit applicable et juridiction compétente</h2>
          <p className="text-gray-300 mb-2">
            Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </section>
      </div>
    </StaticContentPage>
  );
};

export default MentionsLegalesPage;
