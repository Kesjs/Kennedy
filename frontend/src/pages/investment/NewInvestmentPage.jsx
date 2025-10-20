import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  Award, 
  Flame, 
  Calculator, 
  Clock, 
  DollarSign, 
  Info,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import api from '../../services/api';

const NewInvestmentPage = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

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

  const investmentPlans = [
    {
      id: 'starter',
      name: 'Starter',
      minAmount: 100,
      maxAmount: 999,
      dailyReturn: 1.5,
      totalReturn: 45,
      duration: 30,
      icon: Zap,
      iconColor: 'text-blue-400',
      gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-400/10',
      borderColor: 'border-blue-200 dark:border-blue-700',
      features: [
        'Retour quotidien de 1.5%',
        'Durée de 30 jours',
        'Capital garanti',
        'Support standard'
      ]
    },
    {
      id: 'growth',
      name: 'Croissance',
      minAmount: 1000,
      maxAmount: 4999,
      dailyReturn: 2.0,
      totalReturn: 60,
      duration: 30,
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
      gradient: 'bg-gradient-to-br from-emerald-500/20 to-teal-400/10',
      borderColor: 'border-emerald-200 dark:border-emerald-700',
      popular: true,
      features: [
        'Retour quotidien de 2.0%',
        'Durée de 30 jours',
        'Capital garanti',
        'Support prioritaire',
        'Bonus de fidélité'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      minAmount: 5000,
      maxAmount: 19999,
      dailyReturn: 2.5,
      totalReturn: 75,
      duration: 30,
      icon: Award,
      iconColor: 'text-purple-400',
      gradient: 'bg-gradient-to-br from-purple-600/20 to-indigo-500/10',
      borderColor: 'border-purple-200 dark:border-purple-700',
      features: [
        'Retour quotidien de 2.5%',
        'Durée de 30 jours',
        'Capital garanti',
        'Support VIP',
        'Gestionnaire dédié',
        'Rapports détaillés'
      ]
    },
    {
      id: 'elite',
      name: 'Élite',
      minAmount: 20000,
      maxAmount: 100000,
      dailyReturn: 3.0,
      totalReturn: 90,
      duration: 30,
      icon: Flame,
      iconColor: 'text-orange-400',
      gradient: 'bg-gradient-to-br from-amber-500/20 to-orange-500/10',
      borderColor: 'border-orange-200 dark:border-orange-700',
      features: [
        'Retour quotidien de 3.0%',
        'Durée de 30 jours',
        'Capital garanti',
        'Support VIP exclusif',
        'Conseiller personnel',
        'Accès aux opportunités premium',
        'Événements exclusifs'
      ]
    }
  ];

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      const response = await api.get('/api/user/balance');
      setUserBalance(response.data.balance || 0);
    } catch (error) {
      console.error('Erreur lors de la récupération du solde:', error);
    }
  };

  const calculateProjectedReturn = () => {
    if (!selectedPlan || !amount) return { daily: 0, total: 0, profit: 0 };
    
    const investmentAmount = parseFloat(amount);
    const dailyReturn = (investmentAmount * selectedPlan.dailyReturn) / 100;
    const totalReturn = investmentAmount + (dailyReturn * duration);
    const profit = totalReturn - investmentAmount;

    return {
      daily: dailyReturn,
      total: totalReturn,
      profit: profit
    };
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setAmount(plan.minAmount.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      toast.error('Veuillez sélectionner un plan d\'investissement');
      return;
    }

    const investmentAmount = parseFloat(amount);
    
    if (investmentAmount < selectedPlan.minAmount || investmentAmount > selectedPlan.maxAmount) {
      toast.error(`Le montant doit être entre $${selectedPlan.minAmount} et $${selectedPlan.maxAmount}`);
      return;
    }

    if (investmentAmount > userBalance) {
      toast.error('Solde insuffisant pour cet investissement');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await api.post('/api/investments', {
        plan_id: selectedPlan.id,
        plan_name: selectedPlan.name,
        amount: investmentAmount,
        duration: duration,
        daily_return_rate: selectedPlan.dailyReturn,
        expected_return: calculateProjectedReturn().total
      });

      toast.success('Investissement créé avec succès !');
      
      // Réinitialiser le formulaire
      setSelectedPlan(null);
      setAmount('');
      setDuration(30);
      
      // Actualiser le solde
      fetchUserBalance();
      
    } catch (error) {
      console.error('Erreur lors de la création de l\'investissement:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la création de l\'investissement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectedReturn = calculateProjectedReturn();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <span className="inline-block px-3 py-1 text-sm font-semibold text-primary bg-primary/10 rounded-full mb-4">
            Nouvel investissement
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Créer un Investissement
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choisissez votre plan d'investissement et commencez à générer des revenus passifs dès aujourd'hui.
          </p>
          
          {/* Solde utilisateur */}
          <div className="mt-6 inline-flex items-center bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm">
            <DollarSign className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Solde disponible:</span>
            <span className="font-bold text-green-600 dark:text-green-400">${userBalance.toLocaleString()}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sélection du plan */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              custom={1}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Sélectionnez votre plan
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {investmentPlans.map((plan, index) => {
                  const Icon = plan.icon;
                  const isSelected = selectedPlan?.id === plan.id;
                  
                  return (
                    <motion.div
                      key={plan.id}
                      custom={index + 2}
                      initial="hidden"
                      animate="visible"
                      variants={fadeInUp}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'border-primary shadow-lg ring-2 ring-primary/20'
                          : plan.borderColor + ' hover:border-primary/50'
                      } ${plan.popular ? 'ring-2 ring-emerald-400/20' : ''}`}
                      onClick={() => handlePlanSelect(plan)}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                          Populaire
                        </div>
                      )}
                      
                      <div className={`p-6 bg-white dark:bg-gray-800 ${plan.gradient}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ${plan.minAmount.toLocaleString()} - ${plan.maxAmount.toLocaleString()}
                            </p>
                          </div>
                          <Icon className={`w-8 h-8 ${plan.iconColor}`} />
                        </div>
                        
                        <div className="mb-4">
                          <div className="text-3xl font-bold text-gray-900 dark:text-white">
                            {plan.dailyReturn}%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">retour quotidien</div>
                        </div>
                        
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="w-4 h-4 mt-0.5 mr-2 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {isSelected && (
                          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                            <div className="flex items-center text-primary">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              <span className="text-sm font-semibold">Plan sélectionné</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Formulaire d'investissement */}
          <div className="lg:col-span-1">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              custom={3}
              className="sticky top-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Détails de l'investissement
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Montant */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Montant de l'investissement
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min={selectedPlan?.minAmount || 0}
                        max={selectedPlan?.maxAmount || 0}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Entrez le montant"
                        disabled={!selectedPlan}
                      />
                    </div>
                    {selectedPlan && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Min: ${selectedPlan.minAmount.toLocaleString()} - Max: ${selectedPlan.maxAmount.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Durée */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Durée (jours)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        min="1"
                        max="365"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Calculateur de retour */}
                  {selectedPlan && amount && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Calculator className="w-4 h-4 mr-2" />
                        Projection des retours
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Retour quotidien:</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            ${projectedReturn.daily.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Profit total:</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            ${projectedReturn.profit.toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between">
                          <span className="font-semibold text-gray-900 dark:text-white">Total à recevoir:</span>
                          <span className="font-bold text-primary">
                            ${projectedReturn.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bouton de soumission */}
                  <button
                    type="submit"
                    disabled={!selectedPlan || !amount || isSubmitting || parseFloat(amount) > userBalance}
                    className="w-full py-3 px-6 bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : (
                      <ArrowRight className="w-5 h-5 mr-2" />
                    )}
                    {isSubmitting ? 'Création...' : 'Créer l\'investissement'}
                  </button>
                </form>

                {/* Information */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-semibold mb-1">Information importante</p>
                      <p>Les retours sont calculés quotidiennement et versés automatiquement. Le capital initial sera restitué à la fin de la période d'investissement.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewInvestmentPage;
