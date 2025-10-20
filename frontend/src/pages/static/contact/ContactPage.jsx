import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import { FaLinkedinIn, FaTwitter, FaFacebookF } from 'react-icons/fa';
import StaticPageLayout from '../StaticPageLayout';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <FiMail className="w-6 h-6 text-primary-400" />,
      title: 'Email',
      value: 'contact@gazoduc-invest.com',
      link: 'mailto:contact@gazoduc-invest.com'
    },
    {
      icon: <FiPhone className="w-6 h-6 text-primary-400" />,
      title: 'Téléphone',
      value: '+33 1 23 45 67 89',
      link: 'tel:+33123456789'
    },
    {
      icon: <FiMapPin className="w-6 h-6 text-primary-400" />,
      title: 'Adresse',
      value: '123 Rue de l\'Innovation, 75001 Paris, France',
      link: 'https://maps.google.com/?q=123+Rue+de+l\'Innovation,+75001+Paris,+France'
    },
  ];

  const socialLinks = [
    {
      icon: <FaLinkedinIn className="w-5 h-5" />,
      label: 'LinkedIn',
      url: 'https://linkedin.com/company/gazoduc-invest'
    },
    {
      icon: <FaTwitter className="w-5 h-5" />,
      label: 'Twitter',
      url: 'https://twitter.com/gazoduc_invest'
    },
    {
      icon: <FaFacebookF className="w-5 h-5" />,
      label: 'Facebook',
      url: 'https://facebook.com/gazoduc.invest'
    },
  ];

  return (
    <StaticPageLayout 
      title="Contactez-nous"
      breadcrumbs={[
        { name: 'Support', path: '/aide' },
        { name: 'Contact', path: '/contact' }
      ]}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Nous sommes là pour vous aider</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Notre équipe est disponible pour répondre à toutes vos questions. N'hésitez pas à nous contacter par téléphone, email ou via le formulaire ci-dessous.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
              >
                <div className="flex-shrink-0 p-3 rounded-lg bg-primary-900/30 text-primary-400 mr-4 group-hover:bg-primary-600/30 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.value}</p>
                </div>
              </a>
            ))}

            <div className="p-6 bg-white/5 rounded-xl">
              <h3 className="font-medium text-white mb-4">Heures d'ouverture</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span>9h00 - 18h00</span>
                </li>
                <li className="flex justify-between">
                  <span>Samedi</span>
                  <span>10h00 - 14h00</span>
                </li>
                <li className="flex justify-between">
                  <span>Dimanche</span>
                  <span>Fermé</span>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="font-medium text-white mb-3">Suivez-nous</h3>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary-600/30 text-gray-300 hover:text-white transition-colors"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-2xl p-8 h-full">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 text-green-400 mb-4">
                    <FiCheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Message envoyé avec succès !</h3>
                  <p className="text-gray-300 mb-6">
                    Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-semibold text-white mb-6">Envoyez-nous un message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                          Nom complet <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Votre nom"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                        Sujet <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Objet de votre message"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Comment pouvons-nous vous aider ?"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${
                          isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <FiSend className="mr-2" />
                            Envoyer le message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white/5 rounded-2xl overflow-hidden">
          <div className="h-96 w-full">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=123%20Rue%20de%20l'Innovation,%2075001%20Paris,%20France+(Gazoduc%20Invest)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              className="filter grayscale-50 opacity-90"
              aria-label="Carte de localisation de Gazoduc Invest"
            ></iframe>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Notre bureau</h3>
            <p className="text-gray-300 text-sm">
              Notre équipe vous accueille dans nos locaux parisiens. N'hésitez pas à passer nous voir pendant les heures d'ouverture.
            </p>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default ContactPage;
