import React, { useState } from 'react';
import { FiSearch, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';
import StaticPageLayout from '../StaticPageLayout';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openQuestion, setOpenQuestion] = useState(null);

  const categories = [
    { id: 'all', name: 'Toutes les catégories' },
    { id: 'account', name: 'Compte' },
    { id: 'investments', name: 'Investissements' },
    { id: 'payments', name: 'Paiements' },
    { id: 'security', name: 'Sécurité' },
  ];

  const faqs = [
    {
      id: 1,
      question: "Comment créer un compte sur Gazoduc Invest ?",
      answer: "Pour créer un compte, cliquez sur le bouton 'S\'inscrire' en haut à droite de la page d'accueil. Remplissez le formulaire avec vos informations personnelles, vérifiez votre adresse e-mail et complétez la vérification d'identité.",
      category: 'account',
      tags: ['compte', 'inscription']
    },
    {
      id: 2,
      question: "Quels sont les modes de paiement acceptés ?",
      answer: "Nous acceptons les virements bancaires SEPA, les cartes de crédit/débit (Visa, Mastercard) et les paiements par virement instantané. Les cryptomonnaies ne sont pas acceptées pour le moment.",
      category: 'payments',
      tags: ['paiement', 'virement']
    },
    {
      id: 3,
      question: "Comment fonctionnent les retraits ?",
      answer: "Les retraits peuvent être effectués depuis votre tableau de bord. Les fonds sont généralement crédités sous 1 à 3 jours ouvrables. Des frais de retrait peuvent s'appliquer en fonction de votre formule d'abonnement.",
      category: 'payments',
      tags: ['retrait', 'frais']
    },
    {
      id: 4,
      question: "Quelle est la sécurité de mes investissements ?",
      answer: "La sécurité de vos investissements est notre priorité. Nous utilisons le chiffrement de niveau bancaire, l'authentification à deux facteurs et stockons la majorité des fonds dans des portefeuilles hors ligne (cold storage). De plus, nous sommes enregistrés auprès des autorités de régulation financière.",
      category: 'security',
      tags: ['sécurité', 'protection']
    },
    {
      id: 5,
      question: "Puis-je annuler un investissement ?",
      answer: "Les investissements sont généralement irrévocables une fois effectués. Cependant, certains produits peuvent offrir des options de rachat anticipé avec des conditions spécifiques. Veuillez consulter les détails de chaque produit avant investissement.",
      category: 'investments',
      tags: ['annulation', 'retrait']
    },
    {
      id: 6,
      question: "Comment sont calculés les rendements ?",
      answer: "Les rendements sont calculés en fonction des performances des actifs sous-jacents, moins nos frais de gestion. Chaque produit d'investissement a son propre modèle de calcul détaillé dans sa documentation.",
      category: 'investments',
      tags: ['rendement', 'calcul']
    },
  ];

  const filteredFaqs = faqs.filter(faq => 
    (activeCategory === 'all' || faq.category === activeCategory) &&
    (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <StaticPageLayout 
      title="Centre d'Aide"
      breadcrumbs={[
        { name: 'Support', path: '/aide' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        {/* Search Section */}
        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-gray-700 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Rechercher dans l'aide..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Categories Sidebar */}
          <div className="md:w-1/4">
            <div className="sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Catégories</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>

              <div className="mt-8 p-6 bg-white/5 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-3">Besoin d'aide ?</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Notre équipe est là pour vous aider. Contactez-nous par email ou téléphone.
                </p>
                <div className="space-y-3">
                  <a 
                    href="mailto:support@gazoduc-invest.com" 
                    className="flex items-center text-gray-300 hover:text-white transition-colors"
                  >
                    <FiMail className="mr-2" /> support@gazoduc-invest.com
                  </a>
                  <a 
                    href="tel:+33123456789" 
                    className="flex items-center text-gray-300 hover:text-white transition-colors"
                  >
                    <FiPhone className="mr-2" /> +33 1 23 45 67 89
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="md:w-3/4">
            <h2 className="text-2xl font-bold text-white mb-6">Questions fréquentes</h2>
            
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div 
                    key={faq.id} 
                    className="bg-white/5 rounded-xl overflow-hidden transition-all duration-200"
                  >
                    <button
                      className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                      onClick={() => toggleQuestion(faq.id)}
                    >
                      <span className="font-medium text-white">{faq.question}</span>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transform transition-transform ${openQuestion === faq.id ? 'rotate-180' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div 
                      className={`px-6 pb-4 pt-0 transition-all duration-300 overflow-hidden ${
                        openQuestion === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-gray-300">{faq.answer}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {faq.tags.map((tag, i) => (
                          <span 
                            key={i} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-gray-300"
                            onClick={() => setSearchQuery(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <button className="text-sm text-primary-400 hover:text-primary-300 flex items-center">
                          <FiMessageSquare className="mr-1" /> Cette réponse vous a-t-elle été utile ?
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-900/30 text-primary-400 mb-4">
                  <FiSearch className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">Aucun résultat trouvé</h3>
                <p className="text-gray-400">Essayez d'autres termes de recherche ou contactez notre support.</p>
              </div>
            )}

            {/* Contact Form */}
            <div className="mt-12 bg-gradient-to-r from-primary-900/30 to-primary-900/10 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-2">Vous n'avez pas trouvé de réponse ?</h3>
              <p className="text-gray-300 mb-6">Notre équipe de support est là pour vous aider.</p>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nom complet</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Sujet</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Objet de votre demande"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Décrivez votre demande en détail..."
                  ></textarea>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Envoyer le message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default HelpPage;
