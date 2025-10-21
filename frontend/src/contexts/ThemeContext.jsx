import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

// Fonction utilitaire pour appliquer le thème
export const applyTheme = (theme) => {
  const root = window.document.documentElement;
  
  // Désactiver les transitions pendant le changement de thème
  const css = document.createElement('style');
  css.appendChild(document.createTextNode(
    `* {
       -webkit-transition: none !important;
       -moz-transition: none !important;
       -o-transition: none !important;
       -ms-transition: none !important;
       transition: none !important;
    }`
  ));
  document.head.appendChild(css);
  
  // Appliquer le thème
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Forcer un reflow, flush CSS
  const _ = window.getComputedStyle(root).opacity;
  
  // Supprimer le style et réactiver les transitions
  document.head.removeChild(css);
  
  // Définir l'attribut data-theme pour les styles personnalisés
  root.setAttribute('data-theme', theme);
  
  return theme;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Charger le thème sauvegardé ou utiliser le thème du système
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
    
    // Écouter les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) { // Ne pas écraser le choix utilisateur
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    applyTheme(newTheme);
  }, [theme]);

  // Add body classes for transitions
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('transition-colors', 'duration-300', 'ease-in-out');
      return () => {
        document.body.classList.remove('transition-colors', 'duration-300', 'ease-in-out');
      };
    }
  }, []);

  // Don't render anything on the server
  if (!isClient) {
    return null;
  }

  // Render empty div with theme classes while mounting
  if (!mounted) {
    return <div className="min-h-screen" style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      <div className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
