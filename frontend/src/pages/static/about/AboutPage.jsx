import React from 'react';
import StaticPageLayout from '../StaticPageLayout';

const AboutPage = () => {
  return (
    <StaticPageLayout 
      title="À propos de Gazoduc Invest"
      breadcrumbs={[{ name: 'À propos', path: '/a-propos' }]}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Notre Mission</h2>
          <p className="text-gray-300">
            Gazoduc Invest s'engage à démocratiser l'investissement dans le secteur de l'énergie, 
            en particulier dans le Gaz Naturel Liquéfié (GNL), en offrant des opportunités 
            d'investissement accessibles, sécurisées et transparentes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Notre Vision</h2>
          <p className="text-gray-300">
            Nous aspirons à devenir le leader européen des investissements dans le secteur de l'énergie 
            en connectant les investisseurs particuliers à des projets énergétiques durables et rentables.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Notre Équipe</h2>
          <p className="text-gray-300 mb-6">
            Notre équipe est composée d'experts en énergie, en finance et en technologie, 
            unis par une passion commune pour l'innovation et le développement durable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Jean Dupont', role: 'CEO & Fondateur', image: '/team/jean-dupont.jpg' },
              { name: 'Marie Martin', role: 'Directrice Financière', image: '/team/marie-martin.jpg' },
              { name: 'Thomas Leroy', role: 'Responsable des Opérations', image: '/team/thomas-leroy.jpg' },
              { name: 'Sophie Petit', role: 'Responsable Commerciale', image: '/team/sophie-petit.jpg' },
            ].map((member, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-colors">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-700 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                    {member.name.charAt(0)}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                <p className="text-sm text-primary-300">{member.role}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a 
              href="/equipe" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Découvrir toute l'équipe
            </a>
          </div>
        </section>

        <section className="bg-white/5 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Transparence',
                description: 'Nous croyons en une communication claire et honnête avec nos investisseurs.'
              },
              {
                title: 'Innovation',
                description: 'Nous repoussons les limites pour offrir des solutions d\'investissement innovantes.'
              },
              {
                title: 'Durabilité',
                description: 'Nous nous engageons pour un avenir énergétique plus propre et plus durable.'
              }
            ].map((value, index) => (
              <div key={index} className="text-center p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-900/30 flex items-center justify-center text-primary-400">
                  <span className="text-2xl">
                    {index === 0 ? '🔍' : index === 1 ? '💡' : '🌱'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </StaticPageLayout>
  );
};

export default AboutPage;
