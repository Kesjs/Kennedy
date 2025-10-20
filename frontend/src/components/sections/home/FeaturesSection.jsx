import { motion } from 'framer-motion';
import { DollarSign, Shield, Zap, Users, Clock, Globe } from 'lucide-react';

const FeaturesSection = () => {
  // 🎨 Couleurs dynamiques selon le thème - Version noire profonde
  const sectionBg = 'dark:bg-black bg-black';
  const cardBg = 'dark:bg-black/90 dark:border-gray-900 border-gray-800 hover:border-primary/70';
  const textColor = 'text-gray-100';
  const textMuted = 'text-gray-400';
  const accentBg = 'bg-primary/20';
  const accentText = 'text-primary-300';
  const cardHover = 'hover:shadow-primary/30 hover:bg-gray-900/80';

  // 🔹 Couleurs des icônes
  const iconColors = {
    DollarSign: 'text-emerald-500',
    Shield: 'text-blue-500',
    Zap: 'text-yellow-400',
    Users: 'text-pink-500',
    Clock: 'text-orange-500',
    Globe: 'text-indigo-500',
  };

  // ✨ Animation d'apparition
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const features = [
    { icon: DollarSign, title: 'Revenus quotidiens', description: 'Recevez vos gains automatiquement chaque jour.', color: iconColors.DollarSign },
    { icon: Shield, title: 'Sécurité blockchain', description: 'Vos transactions sont cryptées et vérifiables.', color: iconColors.Shield },
    { icon: Zap, title: 'Retours rapides', description: 'Générez des rendements compétitifs sur vos investissements.', color: iconColors.Zap },
    { icon: Users, title: 'Équipe expérimentée', description: 'Notre équipe gère vos investissements avec expertise.', color: iconColors.Users },
    { icon: Clock, title: 'Disponible 24/7', description: 'Accédez à votre compte et gérez vos investissements à tout moment.', color: iconColors.Clock },
    { icon: Globe, title: 'Accès mondial', description: "Investissez depuis n'importe où dans le monde.", color: iconColors.Globe },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-black relative overflow-hidden transition-all duration-300"
    >
      {/* Effet de fond */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent dark:opacity-10 opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px 0px' }}
          variants={fadeInUp}
        >
          <span className={`inline-block px-3 py-1 text-sm font-semibold ${accentText} ${accentBg} rounded-full mb-4`}>
            Nos atouts
          </span>
          <h2 className={`text-3xl sm:text-4xl font-bold ${textColor} mb-6 tracking-tight`}>
            Pourquoi choisir Gazoduc Invest ?
          </h2>
          <p className={`text-lg ${textMuted} max-w-3xl mx-auto`}>
            Découvrez les avantages de notre plateforme d’investissement innovante,
            conçue pour maximiser vos rendements tout en minimisant les risques.
          </p>
        </motion.div>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px 0px' }}
                variants={fadeInUp}
                className={`${cardBg} ${cardHover} backdrop-blur-md rounded-2xl p-6 border transition-all duration-300 group hover:scale-[1.02]`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color} bg-opacity-10 dark:bg-opacity-20`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>

                <h3 className={`text-xl font-semibold ${textColor} mb-2 group-hover:text-primary dark:group-hover:text-primary-300 transition-colors duration-300`}>
                  {feature.title}
                </h3>
                <p className={`${textMuted} transition-colors duration-300`}>
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
