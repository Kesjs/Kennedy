import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import api from '../../services/api';
import {
  FiMessageCircle,
  FiMail,
  FiPhone,
  FiClock,
  FiUser,
  FiHelpCircle,
  FiSend,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiBook,
  FiLifeBuoy,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';

const SupportPage = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('faq');

  // Gérer les paramètres d'URL pour les onglets
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['faq', 'contact', 'tickets', 'help'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'general',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Vérification de l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // FAQ Data
  const faqs = [
    {
      id: 1,
      question: "Comment fonctionne l'investissement dans le GNL avec Gazoduc Invest ?",
      answer: "Gazoduc Invest vous permet d'investir dans des réservoirs de Gaz Naturel Liquéfié. Vous achetez des parts de réservoirs et recevez des revenus quotidiens basés sur la performance des actifs sous-jacents. Les fonds sont gérés par nos experts pour maximiser les rendements tout en minimisant les risques.",
      category: "investment"
    },
    {
      id: 2,
      question: "Quels sont les risques liés à cet investissement ?",
      answer: "Comme tout investissement, celui-ci comporte des risques, notamment la perte en capital. Les performances passées ne préjugent pas des performances futures. Les prix du GNL peuvent varier en fonction des marchés mondiaux, des conditions économiques et de la demande énergétique. Nous recommandons de ne pas investir plus que ce que vous pouvez vous permettre de perdre.",
      category: "investment"
    },
    {
      id: 3,
      question: "Quel est le montant minimum d'investissement ?",
      answer: "Le montant minimum d'investissement est de 32€ pour le forfait Starter. Nous proposons différents niveaux d'investissement pour s'adapter à tous les budgets et objectifs.",
      category: "investment"
    },
    {
      id: 4,
      question: "Quand et comment puis-je retirer mes gains ?",
      answer: "Les gains sont crédités quotidiennement sur votre compte Gazoduc Invest. Vous pouvez effectuer un retrait à tout moment, sous réserve d'un montant minimum de retrait de 10€. Les retraits sont traités sous 2 à 5 jours ouvrés selon votre méthode de retrait.",
      category: "account"
    },
    {
      id: 5,
      question: "Comment sont calculés les rendements ?",
      answer: "Les rendements sont calculés quotidiennement sur la base de la performance des actifs sous-jacents. Les taux varient selon le type de réservoir choisi et les conditions du marché. Vous pouvez suivre en temps réel l'évolution de vos investissements depuis votre tableau de bord.",
      category: "investment"
    },
    {
      id: 6,
      question: "Quelle est la fiscalité applicable ?",
      answer: "Les plus-values réalisées sont soumises à l'impôt sur le revenu dans la catégorie des revenus de capitaux mobiliers. Un prélèvement forfaitaire unique (PFU) de 30% s'applique par défaut, sauf option pour le barème progressif de l'impôt sur le revenu. Nous vous conseillons de consulter un conseiller fiscal pour des informations personnalisées.",
      category: "legal"
    },
    {
      id: 7,
      question: "Comment modifier mes informations personnelles ?",
      answer: "Vous pouvez modifier vos informations personnelles depuis votre profil dans l'espace client. Certaines modifications peuvent nécessiter une vérification d'identité pour des raisons de sécurité.",
      category: "account"
    },
    {
      id: 8,
      question: "Que faire si j'ai oublié mon mot de passe ?",
      answer: "Cliquez sur 'Mot de passe oublié' sur la page de connexion. Vous recevrez un email avec un lien pour réinitialiser votre mot de passe. Si vous ne recevez pas l'email, vérifiez vos spams ou contactez notre support.",
      category: "account"
    },
    {
      id: 9,
      question: "Comment fonctionne le programme de parrainage ?",
      answer: "Partagez votre lien de parrainage unique avec vos amis. Lorsqu'ils s'inscrivent et investissent, vous recevez 5% de commission sur leurs investissements. Les commissions sont créditées automatiquement sur votre compte.",
      category: "referral"
    },
    {
      id: 10,
      question: "Mes données personnelles sont-elles sécurisées ?",
      answer: "Oui, nous utilisons un chiffrement SSL 256 bits et respectons le RGPD. Vos données sont stockées de manière sécurisée et ne sont jamais partagées avec des tiers sans votre consentement explicite.",
      category: "security"
    }
  ];

  // Récupérer les tickets de support
  const { data: supportTickets = [], isLoading: isLoadingTickets } = useQuery({
    queryKey: ['supportTickets'],
    queryFn: async () => {
      const response = await api.get('/api/support/tickets');
      return response.data;
    },
    enabled: !!user && !!isAuthenticated,
    retry: 2,
    onError: (error) => {
      console.error('Error fetching support tickets:', error);
    },
  });

  // Mutation pour envoyer un message de support
  const contactMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post('/api/support/contact', formData);
      return response.data;
    },
    onSuccess: () => {
      setSubmitSuccess(true);
      setContactForm({
        subject: '',
        category: 'general',
        message: '',
        priority: 'normal'
      });
      queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
      setTimeout(() => setSubmitSuccess(false), 5000);
    },
    onError: (error) => {
      console.error('Error sending support message:', error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.subject || !contactForm.message) return;

    setIsSubmitting(true);
    try {
      await contactMutation.mutateAsync({
        ...contactForm,
        userId: user?.id,
        userEmail: user?.email
      });
    } catch (error) {
      console.error('Contact form submission error:', error);
    }
  };

  const tabs = [
    { id: 'faq', name: 'FAQ', icon: FiHelpCircle },
    { id: 'contact', name: 'Nous contacter', icon: FiMail },
    { id: 'tickets', name: 'Mes demandes', icon: FiMessageCircle },
    { id: 'help', name: 'Centre d\'aide', icon: FiBook },
  ];

  const renderFAQ = () => (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Rechercher dans la FAQ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Questions fréquentes */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <div key={faq.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
              {expandedFaq === faq.id ? (
                <FiChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <FiChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {expandedFaq === faq.id && (
              <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300 mt-4">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFaqs.length === 0 && (
        <div className="text-center py-8">
          <FiHelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune question trouvée</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Essayez avec d'autres mots-clés ou contactez notre support.
          </p>
        </div>
      )}
    </div>
  );

  const renderContact = () => (
    <div className="space-y-6">
      {/* Informations de contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiMail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">support@gazoduc-invest.com</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiPhone className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Téléphone</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">+33 1 23 45 67 89</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FiClock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Horaires</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lun-Ven 9h-18h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire de contact */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Envoyer un message</h3>
        
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <FiCheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-800 dark:text-green-200">
                Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégorie
              </label>
              <select
                value={contactForm.category}
                onChange={(e) => setContactForm({...contactForm, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="general">Question générale</option>
                <option value="investment">Investissement</option>
                <option value="account">Compte</option>
                <option value="technical">Problème technique</option>
                <option value="billing">Facturation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priorité
              </label>
              <select
                value={contactForm.priority}
                onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Faible</option>
                <option value="normal">Normale</option>
                <option value="high">Élevée</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sujet
            </label>
            <input
              type="text"
              value={contactForm.subject}
              onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Décrivez brièvement votre demande"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <textarea
              value={contactForm.message}
              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Décrivez votre demande en détail..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !contactForm.subject || !contactForm.message}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiSend className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
        </form>
      </div>
    </div>
  );

  const renderTickets = () => (
    <div className="space-y-6">
      {!user || !isAuthenticated ? (
        <div className="text-center py-8">
          <FiUser className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Connexion requise</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Vous devez être connecté pour voir vos demandes de support.
          </p>
        </div>
      ) : supportTickets.length > 0 ? (
        <div className="space-y-4">
          {supportTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{ticket.subject}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  ticket.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                }`}>
                  {ticket.status === 'open' ? 'Ouvert' : ticket.status === 'pending' ? 'En attente' : 'Fermé'}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{ticket.message}</p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <FiClock className="h-4 w-4 mr-1" />
                {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FiMessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune demande</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Vous n'avez pas encore de demandes de support. Utilisez l'onglet "Nous contacter" pour en créer une.
          </p>
        </div>
      )}
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiBook className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">Guide de démarrage</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Apprenez les bases de l'investissement avec Gazoduc Invest.
          </p>
          <button className="text-blue-600 dark:text-blue-400 hover:underline">
            Lire le guide →
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiLifeBuoy className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">Tutoriels vidéo</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Regardez nos tutoriels pour maîtriser la plateforme.
          </p>
          <button className="text-blue-600 dark:text-blue-400 hover:underline">
            Voir les vidéos →
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FiHelpCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">Base de connaissances</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Consultez notre documentation complète.
          </p>
          <button className="text-blue-600 dark:text-blue-400 hover:underline">
            Explorer →
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FiMessageCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">Chat en direct</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Discutez directement avec notre équipe support.
          </p>
          <button className="text-blue-600 dark:text-blue-400 hover:underline">
            Démarrer le chat →
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'contact':
        return renderContact();
      case 'tickets':
        return renderTickets();
      case 'help':
        return renderHelp();
      default:
        return renderFAQ();
    }
  };

  return (
    <div className="w-full h-full overflow-auto p-0 m-0 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Support Client</h1>
          <p className="mt-1 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Nous sommes là pour vous aider
          </p>
        </div>

        {/* Navigation par onglets */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenu de l'onglet actif */}
        {renderContent()}
      </div>
    </div>
  );
};

export default SupportPage;
