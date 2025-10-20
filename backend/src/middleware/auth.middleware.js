const createError = require('http-errors');
const { createClient } = require('@supabase/supabase-js');

// Initialisation du client Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware d'authentification
const authenticate = async (req, res, next) => {
  try {
    console.log('En-tête d\'autorisation reçu:', req.headers.authorization);
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Erreur: Aucun token fourni ou format incorrect');
      throw createError(401, 'Accès non autorisé - Token manquant');
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extrait:', token ? '***' + token.slice(-8) : 'Aucun token');
    
    // Vérifier le token avec Supabase
    console.log('Vérification du token avec Supabase...');
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Erreur de vérification du token:', error);
      throw createError(401, `Accès non autorisé - ${error.message}`);
    }
    
    if (!data || !data.user) {
      console.error('Aucun utilisateur trouvé pour ce token');
      throw createError(401, 'Accès non autorisé - Utilisateur introuvable');
    }

    console.log('Utilisateur authentifié:', data.user.email);
    // Ajouter l'utilisateur à la requête
    req.user = data.user;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware pour vérifier les rôles
const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw createError(401, 'Non authentifié');
      }

      // Vérifier si l'utilisateur a un des rôles requis
      const userRole = req.user.role || 'user';
      if (!roles.includes(userRole)) {
        throw createError(403, 'Accès non autorisé pour ce rôle');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authenticate,
  authorize
};