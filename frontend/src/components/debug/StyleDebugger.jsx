import { useEffect } from 'react';

const StyleDebugger = () => {
  useEffect(() => {
    console.log('[DEBUG] Vérification des styles...');
    
    // Vérifier les variables CSS
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColor = rootStyles.getPropertyValue('--primary').trim();
    console.log('[DEBUG] Variable CSS --primary:', primaryColor);
    
    // Vérifier la présence des couleurs de thème
    const backgroundColor = rootStyles.getPropertyValue('--background').trim();
    const textColor = rootStyles.getPropertyValue('--foreground').trim();
    console.log('[DEBUG] Couleurs de thème - arrière-plan:', backgroundColor, '- texte:', textColor);
    
    // Tester les classes Tailwind de base
    const testElement = document.createElement('div');
    testElement.className = 'hidden bg-background text-foreground';
    document.body.appendChild(testElement);
    
    const styles = window.getComputedStyle(testElement);
    const isHidden = styles.display === 'none';
    const bgColor = styles.backgroundColor;
    const color = styles.color;
    
    console.log('[DEBUG] Vérification des classes Tailwind:');
    console.log('- .hidden fonctionnel:', isHidden);
    console.log('- Couleur de fond appliquée:', bgColor);
    console.log('- Couleur de texte appliquée:', color);
    
    // Nettoyer
    document.body.removeChild(testElement);
    
    // Vérifier le thème actuel
    const isDark = document.documentElement.classList.contains('dark');
    console.log('[DEBUG] Mode sombre activé:', isDark);
    
  }, []);
  
  return null; // Ce composant ne rend rien
};

export default StyleDebugger;