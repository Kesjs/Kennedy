import { useEffect } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import HeroSection from '../components/sections/home/HeroSection';
import FeaturesSection from '../components/sections/home/FeaturesSection';
import PricingSection from '../components/sections/home/PricingSection';
import CtaSection from '../components/sections/home/CtaSection';
import Footer from '../components/common/Footer';

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
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default HomePage;
