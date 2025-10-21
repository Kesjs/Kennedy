import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShieldAlt, FaLock, FaExchangeAlt, FaClock, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { SiBitcoin, SiEthereum, SiLitecoin } from 'react-icons/si';
import { MdSecurity } from 'react-icons/md';
import { BsCurrencyExchange } from 'react-icons/bs';
import DepositForm from '../../components/deposit/DepositForm';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import dashboardService from '../../services/api/dashboardService';

// Composant pour les avantages du dépôt
const BenefitItem = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
    <div className="flex-shrink-0 p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
      {icon}
    </div>
    <div>
      <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

// Composant pour les étapes du processus
const Step = ({ number, title, description, isLast = false }) => (
  <div className="relative">
    <div className={`flex items-center ${!isLast ? 'pb-10' : ''}`}>
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
        {number}
      </div>
      <div className="ml-4">
        <h4 className="text-lg font-medium text-gray-800 dark:text-white">{title}</h4>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
    {!isLast && (
      <div className="absolute left-5 top-10 h-full w-0.5 bg-gray-700 -z-10"></div>
    )}
  </div>
);

const DepositPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialDeposit, setIsInitialDeposit] = useState(false);
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifier si l'utilisateur est connecté et s'il s'agit d'un dépôt initial
  useEffect(() => {
    const checkInitialDeposit = async () => {
      if (!user) {
        toast.info('Veuillez vous connecter pour effectuer un dépôt');
        navigate('/login', { state: { from: location.pathname } });
        return;
      }

      try {
        // Vérifier si c'est un dépôt initial requis
        const requiresInitialDeposit = location.state?.requiresInitialDeposit || false;
        
        if (requiresInitialDeposit) {
          setIsInitialDeposit(true);
          toast.info('Un dépôt initial est requis pour continuer', { duration: 5000 });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la vérification du dépôt initial:', error);
        toast.error('Erreur lors du chargement des informations de dépôt');
        navigate('/dashboard');
      }
    };

    checkInitialDeposit();
  }, [user, navigate, location]);

  const handleDepositSuccess = async (depositData) => {
    try {
      // Mettre à jour les données utilisateur après un dépôt réussi
      await refreshUserData();
      
      // Afficher un message de succès
      toast.success(`Dépôt de ${depositData.amount} ${depositData.currency} effectué avec succès !`);
      
      // Rediriger vers le tableau de bord après un court délai
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données utilisateur:', error);
      toast.error('Dépôt réussi mais erreur lors de la mise à jour du profil');
      navigate('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-300">Chargement des informations de paiement sécurisées...</p>
          <p className="text-sm text-gray-500 mt-2">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
              Effectuez votre premier dépôt
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {isInitialDeposit 
                ? 'Effectuez votre premier dépôt pour débloquer toutes les fonctionnalités de votre compte et commencer à investir.'
                : 'Ajoutez des fonds à votre compte de manière sécurisée pour profiter de nos opportunités d\'investissement.'}
            </p>
          </motion.div>
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section principale du formulaire */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md dark:shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700/50"
            >
              <div className="p-6 sm:p-8">
                {/* En-tête de la carte */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Détails du dépôt</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Remplissez les détails pour effectuer un dépôt</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-indigo-100 dark:bg-indigo-500/20 px-3 py-1.5 rounded-full">
                    <FaLock className="text-indigo-600 dark:text-indigo-400 text-sm" />
                    <span className="text-xs font-medium text-indigo-700 dark:text-indigo-200">Sécurisé</span>
                  </div>
                </div>

                {/* Formulaire de dépôt */}
                <DepositForm 
                  onDepositSuccess={handleDepositSuccess} 
                  isInitialDeposit={isInitialDeposit}
                />
              </div>
            </motion.div>

            {/* Section d'information sur les frais */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-800/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FaInfoCircle className="text-indigo-600 dark:text-indigo-400 mr-2" />
                Informations importantes
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-600 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                  <span>Les dépôts sont traités sous 24 heures ouvrées</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-600 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                  <span>Pas de frais pour les dépôts par virement bancaire</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-600 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                  <span>Support client disponible 24/7 pour toute assistance</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Barre latérale avec informations */}
          <div className="space-y-6">
            {/* Étapes du processus */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm dark:shadow-none"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Comment effectuer un dépôt</h3>
              <div className="space-y-0">
                <Step 
                  number={1}
                  title="Sélectionnez votre méthode de paiement"
                  description="Choisissez parmi nos options de paiement sécurisées"
                />
                <Step 
                  number={2}
                  title="Entrez le montant"
                  description="Indiquez le montant que vous souhaitez déposer"
                />
                <Step 
                  number={3}
                  title="Confirmez la transaction"
                  description="Vérifiez les détails et confirmez votre dépôt"
                  isLast={true}
                />
              </div>
            </motion.div>

            {/* Avantages */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-xl border border-indigo-800/50"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Pourquoi nous choisir ?</h3>
              <div className="space-y-4">
                <BenefitItem 
                  icon={<FaLock className="w-5 h-5" />} 
                  title="Sécurité maximale" 
                  description="Cryptage bancaire de niveau militaire pour protéger vos transactions"
                />
                <BenefitItem 
                  icon={<FaExchangeAlt className="w-5 h-5" />} 
                  title="Traitement rapide" 
                  description="Dépôts traités en quelques minutes, retraits sous 24h"
                />
                <BenefitItem 
                  icon={<MdSecurity className="w-5 h-5" />} 
                  title="Assurance des fonds" 
                  description="Vos fonds sont protégés et disponibles à tout moment"
                />
              </div>
            </motion.div>

            {/* Devises supportées */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm dark:shadow-none"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Devises supportées</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                  <SiBitcoin className="w-8 h-8 text-orange-500 mb-1" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Bitcoin</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                  <SiEthereum className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-1" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Ethereum</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                  <BsCurrencyExchange className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-1" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Virements</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
