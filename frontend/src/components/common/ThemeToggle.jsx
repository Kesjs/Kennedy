import { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Éviter le flash de thème incorrect côté serveur
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-14 h-8 rounded-full bg-base-300 animate-pulse"></div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 ${
        theme === 'dark' ? 'bg-primary' : 'bg-base-300'
      }`}
      aria-label={`Basculer en mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
    >
      <div
        className={`w-6 h-6 rounded-full shadow-md transform transition-all duration-300 flex items-center justify-center ${
          theme === 'dark' 
            ? 'translate-x-6 bg-base-100 text-primary' 
            : 'translate-x-0 bg-base-100 text-base-content'
        }`}
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
