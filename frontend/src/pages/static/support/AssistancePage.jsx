import React, { useState } from 'react';
import { FiMail, FiPhone, FiMessageSquare, FiClock, FiCheckCircle, FiHeadphones } from 'react-icons/fi';
import StaticContentPage from '../components/StaticContentPage';

const AssistancePage = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Question générale',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pourriez ajouter la logique pour envoyer le formulaire
    console.log('Formulaire soumis:', formData);
    setIsSubmitted(true);
    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: 'Question générale',
        message: ''
      });
      setIsSubmitted(false);
    }, 5000);
  };

  const supportMethods = [
    {
      icon: <FiMessageSquare className="w-8 h-8 text-primary-500" />,
      title: 'Chat en direct',
      description: 'Discutez en direct avec un membre de notre équipe de support',
      availability: 'Disponible 24/7',
      actionText: 'Démarrer le chat',
      onClick: () => alert('Fonctionnalité de chat à implémenter')
    },
    {
      icon: <FiMail className="w-8 h-8 text-primary-500" />,
      title: 'Email',
      description: 'Envoyez-nous un email et nous vous répondrons dans les plus brefs délais',
      availability: 'Réponse sous 24h',
      actionText: 'support@gazoduc-invest.com',
      isEmail: true
    },
    {
      icon: <FiPhone className="w-8 h-8 text-primary-500" />,
      title: 'Téléphone',
      description: 'Parlez directement avec un conseiller',
      availability: 'Lun-Ven, 9h-18h (CET)',
      actionText: '+33 1 23 45 67 89',
      isPhone: true
    }
  ];

  const faqs = [
    {
      question: "Comment puis-je créer un compte ?",
      answer: "Pour créer un compte, cliquez sur le bouton 'S'inscrire' en haut à droite de la page d'accueil et suivez les instructions. Vous devrez fournir quelques informations personnelles et vérifier votre adresse email."
    },
    {
      question: "Comment effectuer un dépôt ?",
      answer: "Connectez-vous à votre compte, allez dans la section 'Portefeuille' et cliquez sur 'Déposer'. Suivez les instructions pour choisir votre méthode de paiement et le montant à déposer."
    },
    {
      question: "Quels sont les frais appliqués ?",
      answer: "Nos frais sont compétitifs et transparents. Les frais exacts dépendent du type de transaction et sont clairement indiqués avant toute confirmation. Consultez notre page des frais pour plus de détails."
    },
    {
      question: "Comment retirer mes fonds ?",
      answer: "Pour effectuer un retrait, connectez-vous à votre compte, allez dans la section 'Portefeuille', sélectionnez 'Retirer' et suivez les instructions. Les retraits sont généralement traités sous 1 à 3 jours ouvrables."
    },
    {
      question: "Mon compte a été compromis, que faire ?",
      answer: "Si vous pensez que votre compte a été compromis, contactez immédiatement notre équipe de support à l'adresse security@gazoduc-invest.com. Nous vous recommandons également de changer votre mot de passe et d'activer l'authentification à deux facteurs."
    }
  ];

  return (
    <StaticContentPage 
      title="Assistance 24/7"
      lastUpdated="15 mars 2024"
    >
      <div className="space-y-12">
        {/* Section d'en-tête */}
        <section className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-900/50 text-primary-300 text-sm font-medium mb-4">
            <FiHeadphones className="mr-2" />
            Support client disponible 24/7
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Comment pouvons-nous vous aider ?</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Notre équipe est là pour vous aider. Choisissez la méthode de contact qui vous convient le mieux.
          </p>
        </section>

        {/* Méthodes de contact */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportMethods.map((method, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-primary-500/30 transition-all duration-200 flex flex-col">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-900/30 flex items-center justify-center mb-3">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1">{method.title}</h3>
                  <p className="text-gray-300 mb-3">{method.description}</p>
                  <div className="text-sm text-gray-400 flex items-center">
                    <FiClock className="mr-1.5" /> {method.availability}
                  </div>
                </div>
                {method.isEmail || method.isPhone ? (
                  <a 
                    href={method.isEmail ? `mailto:${method.actionText}` : `tel:${method.actionText}`}
                    className="mt-auto inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    {method.actionText}
                  </a>
                ) : (
                  <button 
                    onClick={method.onClick}
                    className="mt-auto w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-left"
                  >
                    {method.actionText}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Formulaire de contact */}
        <section className="bg-white/5 rounded-xl p-8 border border-white/10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-semibold text-white mb-4">Envoyez-nous un message</h2>
              <p className="text-gray-300 mb-6">
                Remplissez le formulaire et notre équipe vous répondra dans les plus brefs délais. 
                Les champs marqués d'un astérisque (*) sont obligatoires.
              </p>
              
              {isSubmitted ? (
                <div className="bg-green-900/30 border border-green-800 text-green-300 p-4 rounded-lg flex items-start">
                  <FiCheckCircle className="text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Message envoyé avec succès !</p>
                    <p className="text-sm mt-1">Nous avons bien reçu votre message et vous répondrons dès que possible.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Adresse email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Question générale">Question générale</option>
                      <option value="Problème technique">Problème technique</option>
                      <option value="Demande de compte">Demande de compte</option>
                      <option value="Facturation">Facturation</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              )}
            </div>
            
            <div className="md:w-1/2 md:pl-8 md:border-l border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Questions fréquentes</h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-white/10 pb-4">
                    <h4 className="font-medium text-white">{faq.question}</h4>
                    <p className="text-gray-300 text-sm mt-1">{faq.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">Informations de contact</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FiMail className="text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <a href="mailto:support@gazoduc-invest.com" className="text-primary-400 hover:underline">
                        support@gazoduc-invest.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiPhone className="text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Téléphone</p>
                      <a href="tel:+33123456789" className="text-primary-400 hover:underline">
                        +33 1 23 45 67 89
                      </a>
                      <p className="text-xs text-gray-500 mt-0.5">Lun-Ven, 9h-18h (CET)</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="text-primary-400 mr-3 mt-0.5 flex-shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <div>
                      <p className="text-sm text-gray-400">Adresse</p>
                      <p className="text-gray-300">
                        123 Rue de l'Innovation<br />
                        75001 Paris, France
                      </p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-medium text-white mb-3">Suivez-nous</h4>
                  <div className="flex space-x-4">
                    {['Twitter', 'LinkedIn', 'Facebook'].map((social) => (
                      <a 
                        key={social}
                        href="#" 
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary-500 transition-colors"
                        aria-label={social}
                      >
                        <span className="sr-only">{social}</span>
                        {social.charAt(0)}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section de ressources */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">Ressources utiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Centre d\'aide',
                description: 'Consultez notre base de connaissances pour des réponses aux questions courantes.',
                link: '/aide',
                linkText: 'Accéder au centre d\'aide'
              },
              {
                title: 'Documentation',
                description: 'Téléchargez des guides détaillés et des manuels d\'utilisation.',
                link: '/ressources/documentation',
                linkText: 'Voir la documentation'
              },
              {
                title: 'Statut des services',
                description: 'Vérifiez l\'état actuel de tous nos services et les incidents en cours.',
                link: '/statut',
                linkText: 'Voir le statut'
              }
            ].map((resource, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-primary-500/30 transition-all duration-200">
                <h3 className="text-xl font-semibold text-white mb-2">{resource.title}</h3>
                <p className="text-gray-300 mb-4">{resource.description}</p>
                <a 
                  href={resource.link} 
                  className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors"
                >
                  {resource.linkText}
                  <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </StaticContentPage>
  );
};

export default AssistancePage;
