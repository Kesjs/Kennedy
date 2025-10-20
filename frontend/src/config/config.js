// Configuration de l'application
const config = {
  // URL de l'API en fonction de l'environnement
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    timeout: 30000, // 30 secondes
  },
  
  // Configuration Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    redirectUrl: import.meta.env.VITE_SUPABASE_REDIRECT_URL || 'http://localhost:3002/dashboard',
  },
  
  // Configuration de l'application
  app: {
    name: 'Gazoduc Invest',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  
  // Chemins des assets
  assets: {
    avatars: '/uploads/avatars/',
    documents: '/uploads/documents/',
  },
};

export default config;
