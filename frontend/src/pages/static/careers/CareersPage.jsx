import React, { useState } from 'react';
import StaticPageLayout from '../StaticPageLayout';

const CareersPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const jobOpenings = [
    {
      id: 1,
      title: 'Développeur Full Stack',
      type: 'CDI',
      location: 'Paris, France',
      department: 'Technologie',
      description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe technique.',
      requirements: [
        '3+ ans d\'expérience en développement web',
        'Maîtrise de React et Node.js',
        'Expérience avec les bases de données relationnelles',
        'Connaissance des bonnes pratiques de sécurité'
      ]
    },
    {
      id: 2,
      title: 'Responsable Commercial',
      type: 'CDI',
      location: 'Lyon, France',
      department: 'Commercial',
      description: 'Rejoignez notre équipe commerciale pour développer notre portefeuille clients.',
      requirements: [
        '5+ ans d\'expérience en vente B2B',
        'Expérience dans le secteur de l\'énergie appréciée',
        'Excellentes compétences en négociation',
        'Maitrise de l\'anglais'
      ]
    },
    {
      id: 3,
      title: 'Stagiaire Marketing Digital',
      type: 'Stage',
      location: 'Bordeaux, France',
      department: 'Marketing',
      description: 'Stage passionnant en marketing digital avec une équipe dynamique.',
      requirements: [
        'Étudiant en école de commerce ou université',
        'Intérêt pour le marketing digital',
        'Bonne maîtrise des réseaux sociaux',
        'Créativité et esprit d\'initiative'
      ]
    },
  ];

  const departments = ['Tous les départements', 'Technologie', 'Commercial', 'Marketing'];
  const jobTypes = ['Tous les types', 'CDI', 'CDD', 'Stage'];

  const filteredJobs = jobOpenings.filter(job => {
    if (activeTab === 'all') return true;
    return job.department === activeTab || job.type === activeTab;
  });

  return (
    <StaticPageLayout 
      title="Carrières chez Gazoduc Invest"
      breadcrumbs={[
        { name: 'À propos', path: '/a-propos' },
        { name: 'Carrières', path: '/carrieres' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Rejoignez Notre Aventure</h2>
          <p className="text-xl text-gray-300">
            Contribuez à la révolution de l'investissement énergétique avec une équipe passionnée et innovante.
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-semibold text-white mb-6">Pourquoi nous rejoindre ?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Croissance',
                description: 'Opportunités d\'évolution et de développement professionnel',
                icon: '📈'
              },
              {
                title: 'Flexibilité',
                description: 'Télétravail et horaires flexibles selon les postes',
                icon: '🔄'
              },
              {
                title: 'Impact',
                description: 'Contribuez à un avenir énergétique plus durable',
                icon: '🌍'
              }
            ].map((item, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-white mb-6">Nos Offres d'Emploi</h3>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Toutes les offres
            </button>
            {departments.slice(1).map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveTab(dept)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === dept 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-semibold text-white">{job.title}</h4>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="text-sm px-3 py-1 bg-white/10 rounded-full">{job.type}</span>
                        <span className="text-sm text-gray-400 flex items-center">
                          📍 {job.location}
                        </span>
                        <span className="text-sm text-gray-400 flex items-center">
                          🏢 {job.department}
                        </span>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors whitespace-nowrap">
                      Postuler
                    </button>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-300 mb-3">{job.description}</p>
                    <h5 className="font-medium text-white mb-2">Compétences requises :</h5>
                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                      {job.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">Aucune offre ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-900/30 to-primary-900/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-semibold text-white mb-4">Vous ne trouvez pas votre bonheur ?</h3>
          <p className="text-gray-300 mb-6">
            Envoyez-nous votre candidature spontanée. Nous sommes toujours à la recherche de talents passionnés !
          </p>
          <button className="px-6 py-3 bg-white text-gray-900 hover:bg-gray-200 font-medium rounded-lg transition-colors">
            Candidature spontanée
          </button>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default CareersPage;
