import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Zap, Award, Flame, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import api from '../../services/api';

const InvestmentPage = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const plans = [
    {
      name: 'Starter',
      price: 100,
      fee: 0,
      badge: 'Parfait pour débuter',
      icon: Zap,
      popular: false,
      iconColor: 'text-blue-400',
      gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-400/10',
      features: [
        'Retour sur investissement garanti',
        'Support prioritaire',
        'Accès à la plateforme',
        'Rapports mensuels'
      ]
    },
    {
      name: 'Croissance',
      price: 225,
      fee: 0,
      badge: 'Meilleur choix',
      icon: TrendingUp,
      popular: true,
      iconColor: 'text-emerald-400',
      gradient: 'bg-gradient-to-br from-emerald-500/20 to-teal-400/10',
      features: [
        'Tout dans Starter, plus:',
        'Retour sur investissement supérieur',
        'Support 24/7',
        'Analyse personnalisée',
        'Rapports hebdomadaires'
      ]
    },
    {
      name: 'Premium',
      price: 999,
      fee: 30,
      badge: 'Investisseur avancé',
      icon: Award,
      popular: false,
      iconColor: 'text-purple-400',
      gradient: 'bg-gradient-to-br from-purple-600/20 to-indigo-500/10',
      features: [
        'Tout dans Croissance, plus:',
        'Gestion de portefeuille personnalisée',
        'Rencontres trimestrielles',
        'Accès anticipé aux opportunités',
        'Rapports détaillés',
        'Assistance VIP dédiée'
      ]
    },
    {
      name: 'Élite',
      price: 1999,
      fee: 30,
      badge: 'Investisseur professionnel',
      icon: Flame,
      popular: false,
      iconColor: 'text-orange-400',
      gradient: 'bg-gradient-to-br from-amber-500/20 to-orange-500/10',
      features: [
        'Tout dans Premium, plus:',
        'Stratégie d\'investissement sur mesure',
        'Rencontres mensuelles',
        'Accès exclusif aux opportunités',
        'Rapports personnalisés',
        'Conseiller personnel dédié',
        'Invitations aux événements VIP'
      ]
    }
  ];

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setAmount(plan.price.toString());
    setShowModal(true);
  };

  const handleConfirmSubscription = async () => {
    if (!amount || parseFloat(amount) < selectedPlan.price) {
      toast.error(`Le montant minimum est de $${selectedPlan.price}`);
      return;
    }

    try {
      setSubscribing(true);
      await api.post('/api/investments', {
        plan_name: selectedPlan.name,
        amount: parseFloat(amount),
        fee: selectedPlan.fee
      });
      
      toast.success('Souscription réussie ! Votre investissement a été enregistré.');
      setShowModal(false);
      setAmount('');
      setSelectedPlan(null);
    } catch (err) {
      console.error('Subscription error:', err);
      toast.error(err.response?.data?.message || 'Erreur lors de la souscription');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <span className="inline-block px-3 py-1 text-sm font-semibold text-primary bg-primary/10 rounded-full mb-4">
            Nos offres
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Plans d'Investissement
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Sélectionnez le forfait qui correspond à vos objectifs financiers et commencez à générer des revenus dès aujourd'hui.
          </p>
        </motion.div>

        {/* Grille des plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-emerald-400/50 hover:border-emerald-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                    Populaire
                  </div>
                )}
                
                <div className={`p-6 flex flex-col h-full ${plan.gradient}`}>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                        <span className="text-sm text-primary">{plan.badge}</span>
                      </div>
                      <div>
                        <Icon className={`w-8 h-8 ${plan.iconColor}`} />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                      {plan.fee > 0 && (
                        <span className="text-gray-600 dark:text-gray-400"> + ${plan.fee} de frais</span>
                      )}
                      <span className="block text-sm text-gray-600 dark:text-gray-400 mt-1">Investissement unique</span>
                    </div>
                    
                    <ul className="space-y-3 mb-6 text-sm text-gray-700 dark:text-gray-300">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-4 h-4 mt-0.5 mr-2 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubscribe(plan)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all mt-auto ${
                      plan.popular
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                        : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                  >
                    Souscrire {plan.name}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <motion.div 
          className="mt-16 text-center text-gray-600 dark:text-gray-400 text-sm"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <p>Vous avez besoin d'une solution personnalisée ? <a href="/contact" className="text-primary hover:underline">Contactez-nous</a></p>
        </motion.div>
      </div>

      {/* Modal de souscription */}
      <AnimatePresence>
        {showModal && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${selectedPlan.gradient} mb-4`}>
                  {React.createElement(selectedPlan.icon, { className: `w-8 h-8 ${selectedPlan.iconColor}` })}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Souscrire au plan {selectedPlan.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedPlan.badge}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Montant de l'investissement
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={selectedPlan.price}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder={`Min. $${selectedPlan.price}`}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Montant minimum : ${selectedPlan.price}
                  {selectedPlan.fee > 0 && ` (+ ${selectedPlan.fee}$ de frais)`}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Résumé</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Montant</span>
                    <span className="font-semibold text-gray-900 dark:text-white">${amount || 0}</span>
                  </div>
                  {selectedPlan.fee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Frais</span>
                      <span className="font-semibold text-gray-900 dark:text-white">${selectedPlan.fee}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-primary">${(parseFloat(amount) || 0) + selectedPlan.fee}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmSubscription}
                  disabled={subscribing || !amount || parseFloat(amount) < selectedPlan.price}
                  className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {subscribing ? 'Traitement...' : 'Confirmer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvestmentPage;
