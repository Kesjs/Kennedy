import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const GlassFooter = () => {
  const year = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.footer 
      className="border-t border-white/10 bg-black/70 backdrop-blur-md py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px 0px" }}
      variants={fadeInUp}
      style={{
        WebkitBackdropFilter: 'blur(12px)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Colonne Logo et description */}
          <div className="md:col-span-1">
            <div className="flex flex-col items-start mb-6">
              <Link 
                to="/" 
                className="flex items-center space-x-3 no-underline hover:no-underline group"
                onClick={scrollToTop}
              >
                <div className="relative h-16 w-16">
                  <img 
                    src="https://i.pinimg.com/originals/86/9f/b0/869fb06135a2dc55e520ce34cfe6c385.jpg" 
                    alt="Logo Gazoduc Invest" 
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-lg font-bold text-primary-300 underline decoration-primary-300 decoration-2">
                  Gazoduc Invest.
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Investissement dans le Gaz Naturel Liquéfié avec un focus sur la sécurité et la transparence.
                Maximisez vos rendements avec nos solutions d'investissement innovantes.
              </p>
              <div className="text-gray-400 text-sm space-y-1 mb-4">
                <p className="font-medium text-white">Siège social :</p>
                <p>Admiraal de Ruijterweg 401</p>
                <p>1055MD Amsterdam, Pays-Bas</p>
                <p>Tél: 020-674 33 79</p>
              </div>
              <div className="flex gap-3">
                {[
                  { name: 'Twitter', icon: '🐦' },
                  { name: 'LinkedIn', icon: '🔗' },
                  { name: 'Facebook', icon: '👍' },
                  { name: 'Instagram', icon: '📸' }
                ].map((social) => (
                  <a 
                    key={social.name}
                    href="#" 
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
                    aria-label={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                    <span className="sr-only">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne Produit */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">Produit</h4>
            <ul className="space-y-3">
              {[
                { text: 'Fonctionnalités', to: '/a-propos' },
                { text: 'Nos offres', to: '/invest' },
                { text: 'Témoignages', to: '/#testimonials' },
                { text: 'Tarification', to: '/#pricing' }
              ].map((item) => (
                <li key={item.text}>
                  <Link 
                    to={item.to} 
                    className="text-gray-400 hover:text-primary-200 transition-colors duration-200 group flex items-start"
                    onClick={scrollToTop}
                  >
                    <span className="opacity-0 -ml-4 group-hover:opacity-100 text-primary-200 mr-1 transition-opacity">→</span>
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne Entreprise */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">Entreprise</h4>
            <ul className="space-y-3">
              {[
                { text: 'À propos', to: '/a-propos' },
                { text: 'Notre équipe', to: '/a-propos#equipe' },
                { text: 'Carrières', to: '/contact' },
                { text: 'Blog', to: '/contact' }
              ].map((item) => (
                <li key={item.text}>
                  <Link 
                    to={item.to} 
                    className="text-gray-400 hover:text-primary-200 transition-colors duration-200 group flex items-start"
                    onClick={scrollToTop}
                  >
                    <span className="opacity-0 -ml-4 group-hover:opacity-100 text-primary-200 mr-1 transition-opacity">→</span>
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne Support */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">Support</h4>
            <ul className="space-y-3">
              {[
                { text: 'Centre d\'aide', to: '/faq' },
                { text: 'Contact', to: '/contact' },
                { text: 'FAQ', to: '/faq' },
                { text: 'Documentation', to: '/faq' }
              ].map((item) => (
                <li key={item.text}>
                  <Link 
                    to={item.to} 
                    className="text-gray-400 hover:text-primary-200 transition-colors duration-200 group flex items-start"
                    onClick={scrollToTop}
                  >
                    <span className="opacity-0 -ml-4 group-hover:opacity-100 text-primary-200 mr-1 transition-opacity">→</span>
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 text-center md:text-left mb-4 md:mb-0">
            &copy; {year} Gazoduc Invest. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link to="/mentions-legales" className="text-sm text-gray-500 hover:text-primary-200 transition-colors duration-200" onClick={scrollToTop}>
              Mentions légales
            </Link>
            <Link to="/confidentialite" className="text-sm text-gray-500 hover:text-primary-200 transition-colors duration-200" onClick={scrollToTop}>
              Confidentialité
            </Link>
            <Link to="/conditions" className="text-sm text-gray-500 hover:text-primary-200 transition-colors duration-200" onClick={scrollToTop}>
              Conditions d'utilisation
            </Link>
            <Link to="/cookies" className="text-sm text-gray-500 hover:text-primary-200 transition-colors duration-200" onClick={scrollToTop}>
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default GlassFooter;
