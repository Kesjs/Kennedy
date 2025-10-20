import { motion } from 'framer-motion';
import { Check, Zap, Shield, TrendingUp } from 'lucide-react';
import heroImage from '../../../images/hero-image.jpg';

const badges = [
  { 
    id: 1, 
    text: 'Rendement garanti', 
    icon: <Shield className="w-4 h-4" />,
    bg: 'bg-green-500/10',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/20'
  },
  { 
    id: 2, 
    text: 'Investissement sécurisé', 
    icon: <Check className="w-4 h-4" />,
    bg: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/20'
  },
  { 
    id: 3, 
    text: 'Croissance rapide', 
    icon: <TrendingUp className="w-4 h-4" />,
    bg: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/20'
  },
  
];

const HeroSection = ({ scrollTo }) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    }
  };


  return (
    <section className="relative pt-32 pb-40 md:pt-40 md:pb-56 overflow-hidden" id="hero">
      {/* Fond dégradé animé */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-900/95"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-40"></div>
        
        {/* Effets de particules subtils */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            initial={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              opacity: 0
            }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Séparation en bas de la section Hero */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center md:text-left"
          >
            {/* Badges au-dessus du titre */}
            <motion.div 
              className="flex flex-wrap justify-center md:justify-start gap-2 mb-6"
              variants={fadeInUp}
            >
              {badges.map((badge, index) => (
                <motion.span
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      delay: 0.1 * index,
                      duration: 0.3
                    } 
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${badge.bg} ${badge.textColor} border ${badge.borderColor} backdrop-blur-sm`}
                >
                  {badge.icon}
                  {badge.text}
                </motion.span>
              ))}
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Investissez dans l'<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">énergie du futur</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Rejoignez la révolution énergétique et générez des <span className="font-medium text-white">revenus passifs</span> grâce à nos solutions d'investissement innovantes dans le secteur gazier.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <motion.button
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 0 20px -5px rgba(139, 92, 246, 0.5)"
                }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-violet-500/30 relative overflow-hidden group"
                onClick={() => scrollTo('pricing')}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Commencer maintenant
                </span>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </motion.button>
              
              <motion.button
                whileHover={{ 
                  scale: 1.03,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)'
                }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 group"
                onClick={() => scrollTo('features')}
              >
                En savoir plus
              </motion.button>
            </div>

          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-2xl blur-xl -z-10"></div>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-900/50 backdrop-blur-sm">
              <img 
                src={heroImage} 
                alt="Investissement énergétique" 
                className="w-full h-auto object-cover opacity-90"
              />
            </div>
          </motion.div>
        </div>

      </div>
      
      {/* Dégradé de transition vers la section suivante */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;
