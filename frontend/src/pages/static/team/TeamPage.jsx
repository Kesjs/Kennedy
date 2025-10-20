import React from 'react';
import StaticPageLayout from '../StaticPageLayout';

const TeamPage = () => {
  const teamMembers = [
    {
      name: 'Jean Dupont',
      role: 'CEO & Fondateur',
      bio: 'Expert en énergie avec plus de 15 ans d\'expérience dans le secteur du GNL.',
      image: '/team/jean-dupont.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
      },
    },
    {
      name: 'Marie Martin',
      role: 'Directrice Financière',
      bio: '15+ ans d\'expérience en finance d\'entreprise et levée de fonds.',
      image: '/team/marie-martin.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
      },
    },
    {
      name: 'Thomas Leroy',
      role: 'Responsable des Opérations',
      bio: 'Expert en logistique et gestion de projets énergétiques complexes.',
      image: '/team/thomas-leroy.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
      },
    },
    {
      name: 'Sophie Petit',
      role: 'Responsable Commerciale',
      bio: 'Spécialiste des relations clients et du développement commercial.',
      image: '/team/sophie-petit.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
      },
    },
  ];

  return (
    <StaticPageLayout 
      title="Notre Équipe"
      breadcrumbs={[
        { name: 'À propos', path: '/a-propos' },
        { name: 'Notre équipe', path: '/equipe' }
      ]}
    >
      <div className="text-center max-w-3xl mx-auto mb-12">
        <p className="text-xl text-gray-300">
          Rencontrez l'équipe passionnée qui fait de Gazoduc Invest un leader dans l'investissement énergétique.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <div 
            key={index} 
            className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gray-700 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <h3 className="text-xl font-bold text-white">{member.name}</h3>
            <p className="text-primary-300 mb-4">{member.role}</p>
            <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
            <div className="flex justify-center space-x-3">
              <a 
                href={member.social.linkedin} 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={`LinkedIn de ${member.name}`}
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a 
                href={member.social.twitter} 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={`Twitter de ${member.name}`}
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-gradient-to-r from-primary-900/30 to-primary-900/10 rounded-2xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Rejoignez Notre Équipe</h2>
          <p className="text-xl text-gray-300 mb-8">
            Vous souhaitez faire partie d'une équipe qui façonne l'avenir de l'investissement énergétique ?
          </p>
          <a 
            href="/carrieres" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Voir nos offres d'emploi
          </a>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default TeamPage;
