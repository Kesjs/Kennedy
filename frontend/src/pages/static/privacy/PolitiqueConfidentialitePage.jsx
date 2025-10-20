import React from 'react';
import StaticContentPage from '../components/StaticContentPage';

const PolitiqueConfidentialitePage = () => {
  return (
    <StaticContentPage 
      title="Politique de Confidentialité"
      lastUpdated="15 mars 2024"
    >
      <div className="space-y-8">
        <section>
          <p className="text-gray-300 mb-6">
            Chez Gazoduc Invest, nous prenons la protection de vos données personnelles très au sérieux. 
            Cette politique de confidentialité vous explique quelles données nous collectons, comment nous les utilisons 
            et quels sont vos droits en matière de protection des données.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Responsable du traitement</h2>
          <p className="text-gray-300 mb-4">
            Le responsable du traitement des données est :
          </p>
          <div className="bg-white/5 p-6 rounded-lg mb-6">
            <p className="font-medium">Gazoduc Invest SAS</p>
            <p>123 Rue de l'Innovation</p>
            <p>75001 Paris, France</p>
            <p>Email : dpo@gazoduc-invest.com</p>
          </div>
          <p className="text-gray-300">
            Nous avons désigné un Délégué à la Protection des Données (DPO) que vous pouvez contacter à l'adresse email ci-dessus.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">2. Données que nous collectons</h2>
          <p className="text-gray-300 mb-4">
            Nous collectons différentes catégories de données à caractère personnel, notamment :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
            <li><span className="font-medium">Données d'identification :</span> nom, prénom, adresse email, numéro de téléphone, date de naissance</li>
            <li><span className="font-medium">Données de connexion :</span> adresse IP, journaux de connexion, données de navigation</li>
            <li><span className="font-medium">Données financières :</span> informations de paiement, historique des transactions</li>
            <li><span className="font-medium">Données de profil :</span> préférences, centres d'intérêt, historique des interactions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">3. Finalités du traitement</h2>
          <p className="text-gray-300 mb-4">
            Nous utilisons vos données personnelles aux fins suivantes :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
            <li>Exécution des contrats et prestation de nos services</li>
            <li>Vérification de votre identité et prévention de la fraude</li>
            <li>Gestion de la relation client et support utilisateur</li>
            <li>Envoi d'informations sur nos services et offres promotionnelles (avec votre consentement)</li>
            <li>Amélioration de nos services et personnalisation de votre expérience</li>
            <li>Respect de nos obligations légales et réglementaires</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">4. Base légale du traitement</h2>
          <p className="text-gray-300 mb-4">
            Le traitement de vos données est fondé sur :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
            <li>L'exécution d'un contrat auquel vous êtes partie</li>
            <li>Le respect d'une obligation légale à laquelle nous sommes soumis</li>
            <li>Votre consentement pour les finalités spécifiques nécessitant votre accord</li>
            <li>Notre intérêt légitime, sous réserve que vos droits et libertés fondamentaux ne prévalent pas</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Destinataires des données</h2>
          <p className="text-gray-300 mb-4">
            Vos données peuvent être communiquées à :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
            <li>Nos prestataires de services techniques (hébergeurs, fournisseurs de services de paiement, etc.)</li>
            <li>Nos partenaires commerciaux, uniquement avec votre consentement explicite</li>
            <li>Les autorités compétentes, dans les cas prévus par la loi</li>
          </ul>
          <p className="text-gray-300 mb-2">
            Nous exigeons de tous nos prestataires qu'ils mettent en œuvre des mesures de sécurité appropriées pour protéger vos données.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">6. Transferts de données hors UE</h2>
          <p className="text-gray-300 mb-4">
            Dans le cadre de nos activités, il est possible que vos données soient transférées vers des pays situés en dehors de l'Union Européenne. Dans ce cas, nous nous assurons que :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
            <li>Le pays bénéficie d'une décision d'adéquation de la Commission européenne</li>
            <li>Des clauses contractuelles types de la Commission européenne sont mises en place</li>
            <li>Des règles d'entreprise contraignantes sont appliquées</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">7. Durée de conservation</h2>
          <p className="text-gray-300 mb-4">
            Nous conservons vos données personnelles aussi longtemps que nécessaire aux fins pour lesquelles elles ont été collectées, en tenant compte notamment :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
            <li>De la durée de notre relation contractuelle</li>
            <li>De nos obligations légales de conservation</li>
            <li>Des délais de prescription légaux</li>
            <li>Des recommandations des autorités compétentes</li>
          </ul>
          <p className="text-gray-300">
            Une fois ces durées expirées, vos données sont supprimées ou anonymisées.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">8. Vos droits</h2>
          <p className="text-gray-300 mb-4">
            Conformément à la réglementation sur la protection des données, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
            <li><span className="font-medium">Droit d'accès :</span> obtenir la confirmation que des données vous concernant sont traitées et y accéder</li>
            <li><span className="font-medium">Droit de rectification :</span> faire corriger des données inexactes ou incomplètes</li>
            <li><span className="font-medium">Droit à l'effacement :</span> obtenir l'effacement de vos données dans certains cas</li>
            <li><span className="font-medium">Droit à la limitation :</span> restreindre le traitement de vos données</li>
            <li><span className="font-medium">Droit à la portabilité :</span> recevoir vos données dans un format structuré et les transmettre à un autre responsable</li>
            <li><span className="font-medium">Droit d'opposition :</span> vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière</li>
            <li><span className="font-medium">Définir des directives relatives au sort de vos données après votre décès</span></li>
          </ul>
          <p className="text-gray-300 mb-2">
            Pour exercer ces droits, vous pouvez nous contacter à l'adresse email suivante : <a href="mailto:dpo@gazoduc-invest.com" className="text-primary-400 hover:underline">dpo@gazoduc-invest.com</a>
          </p>
          <p className="text-gray-300">
            Vous avez également le droit d'introduire une réclamation auprès de la CNIL si vous estimez que nos pratiques ne respectent pas la réglementation sur la protection des données.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">9. Sécurité</h2>
          <p className="text-gray-300 mb-4">
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction. Parmi ces mesures :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
            <li>Chiffrement des données sensibles</li>
            <li>Sauvegardes régulières</li>
            <li>Authentification forte pour l'accès aux comptes</li>
            <li>Formation de nos employés à la protection des données</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">10. Cookies et technologies similaires</h2>
          <p className="text-gray-300 mb-4">
            Notre site utilise des cookies et des technologies similaires. Pour plus d'informations, veuillez consulter notre <a href="/cookies" className="text-primary-400 hover:underline">Politique relative aux Cookies</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">11. Modifications de la politique de confidentialité</h2>
          <p className="text-gray-300 mb-4">
            Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. Toute modification entrera en vigueur dès sa publication sur notre site. Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance des éventuelles mises à jour.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">12. Nous contacter</h2>
          <p className="text-gray-300 mb-2">
            Pour toute question relative à la présente politique de confidentialité ou à la protection de vos données, vous pouvez nous contacter :
          </p>
          <div className="bg-white/5 p-6 rounded-lg">
            <p>Par email : <a href="mailto:dpo@gazoduc-invest.com" className="text-primary-400 hover:underline">dpo@gazoduc-invest.com</a></p>
            <p>Par courrier : Gazoduc Invest - Service Protection des Données</p>
            <p>123 Rue de l'Innovation, 75001 Paris, France</p>
          </div>
        </section>
      </div>
    </StaticContentPage>
  );
};

export default PolitiqueConfidentialitePage;
