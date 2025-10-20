import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black/80 text-gray-300 py-4 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-2 md:mb-0">
            &copy; {currentYear} Gazoduc Invest. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/a-propos" className="text-sm text-gray-400 hover:text-white transition-colors">
              À propos
            </Link>
            <Link to="/conditions" className="text-sm text-gray-400 hover:text-white transition-colors">
              Conditions d'utilisation
            </Link>
            <Link to="/confidentialite" className="text-sm text-gray-400 hover:text-white transition-colors">
              Confidentialité
            </Link>
            <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
