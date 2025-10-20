import { motion } from 'framer-motion';

const CtaSection = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };

  return (
    <section className="relative py-20 bg-black overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#7C3AED08_1px,transparent_1px),linear-gradient(to_bottom,#7C3AED08_1px,transparent_1px)] bg-[size:48px_48px]"></div>
      </div>
      
      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px 0px" }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          Prêt à commencer ?
        </h2>
        <p className="text-base sm:text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
          Rejoignez plus de 10 000 investisseurs et commencez à générer des revenus passifs dès aujourd'hui.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a 
            href="/RegisterPage"
            className="px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg font-semibold text-lg transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Créer mon compte gratuitement
          </motion.a>
          <motion.a 
            href="/LoginPage"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-lg transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Se connecter
          </motion.a>
        </div>
        <p className="mt-6 text-sm text-gray-400">
          Sans engagement • Sécurisé • Support 24/7
        </p>
      </motion.div>
    </section>
  );
};

export default CtaSection;
