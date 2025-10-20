import { useEffect, useState } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import HeroSection from '../components/sections/home/HeroSection';
import FeaturesSection from '../components/sections/home/FeaturesSection';
import PricingSection from '../components/sections/home/PricingSection';
import CtaSection from '../components/sections/home/CtaSection';
import AboutSection from '../components/sections/home/About';
import GlassFooter from '../components/common/GlassFooter';
import GlassNavbar from '../components/common/GlassNavbar';

const HomePage = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // Ajout d'un padding en haut pour éviter que le contenu ne soit caché sous la navbar
  useEffect(() => {
    document.documentElement.style.setProperty('--header-height', '80px');
    return () => {
      document.documentElement.style.removeProperty('--header-height');
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <GlassNavbar />
      
      {/* Hero Section */}
      <section className="relative">
        <HeroSection />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent -mb-16 z-10"></div>
      </section>
      
      {/* Features Section */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent -mt-16 z-10"></div>
        <FeaturesSection />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto max-w-7xl"></div>
      </div>
      
      {/* Pricing Section */}
      <div className="relative">
        <PricingSection />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto max-w-7xl"></div>
      </div>
      
      {/* CTA Section */}
      <div className="relative">
        <CtaSection />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto max-w-7xl"></div>
      </div>
      
      {/* About Section */}
      <div className="relative">
        <AboutSection />
      </div>
      
      <GlassFooter />
      
      {/* Bouton de retour en haut */}
      <ScrollToTopButton />
    </div>
  );
};

// Composant du bouton de retour en haut
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-primary/90 hover:bg-primary text-white shadow-lg transition-all duration-300 hover:shadow-primary/40"
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default HomePage;
