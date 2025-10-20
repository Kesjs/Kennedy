const { createClient } = require('@supabase/supabase-js');
const createError = require('http-errors');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);

// Middleware pour vérifier l'authentification
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'Accès non autorisé - Token manquant');
    }

    const token = authHeader.split(' ')[1];
    
    // Vérifier le token avec Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw createError(401, 'Accès non autorisé - Token invalide');
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware pour vérifier les rôles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw createError(401, 'Accès non autorisé - Utilisateur non authentifié');
      }

      if (!roles.includes(req.user.role)) {
        throw createError(403, 'Accès refusé - Droits insuffisants');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware de gestion des erreurs
exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Une erreur est survenue';
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
