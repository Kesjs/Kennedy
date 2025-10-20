const { isHttpError } = require('http-errors');
const logger = require('../utils/logger');

// Fonction pour traduire les messages d'erreur de Supabase
function getSupabaseErrorMessage(error) {
  const { code, message } = error;
  
  const errorMessages = {
    // Erreurs de connexion
    'email_not_confirmed': {
      message: 'Veuillez vérifier votre adresse email avant de vous connecter.',
      type: 'email_not_verified',
      status: 403
    },
    'invalid_credentials': {
      message: 'Email ou mot de passe incorrect',
      type: 'invalid_credentials',
      status: 401
    },
    'user_not_found': {
      message: 'Aucun compte trouvé avec cet email',
      type: 'user_not_found',
      status: 404
    },
    'invalid_email': {
      message: 'Adresse email invalide',
      type: 'invalid_email',
      status: 400
    },
    'invalid_password': {
      message: 'Mot de passe incorrect',
      type: 'invalid_password',
      status: 401
    },
    'too_many_requests': {
      message: 'Trop de tentatives. Veuillez réessayer plus tard.',
      type: 'too_many_attempts',
      status: 429
    },
    // Erreurs d'inscription
    'email_already_in_use': {
      message: 'Un compte existe déjà avec cette adresse email',
      type: 'email_exists',
      status: 409
    },
    'weak_password': {
      message: 'Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.',
      type: 'weak_password',
      status: 400
    }
  };

  // Si on a un message personnalisé pour ce code d'erreur
  if (errorMessages[code]) {
    return errorMessages[code];
  }

  // Pour les erreurs non gérées spécifiquement
  return {
    message: message || 'Une erreur est survenue lors de l\'authentification',
    type: 'authentication_error',
    status: error.status || 500
  };
}

// Middleware de gestion des erreurs
exports.errorHandler = (err, req, res, next) => {
  try {
    // Journaliser l'erreur
    const errorMessage = (err && (err.message || err.error_description)) || 'Une erreur inconnue est survenue';
    const errorStack = (process.env.NODE_ENV === 'development' && err?.stack) ? err.stack : undefined;
    
    // Vérifier si c'est une erreur de Supabase
    const isSupabaseError = err?.__isAuthError || (err?.status && err?.code);
    
    // Journalisation détaillée
    const logData = {
      message: errorMessage,
      url: req?.originalUrl,
      method: req?.method,
      ip: req?.ip,
    };

    // Ajouter des détails supplémentaires en mode développement
    if (process.env.NODE_ENV === 'development') {
      logData.stack = errorStack;
      if (isSupabaseError) {
        logData.supabaseError = {
          code: err.code,
          status: err.status,
          originalError: err.originalError
        };
      }
    }
    
    logger.error(logData);

    // Si c'est une erreur de validation (Joi, etc.)
    if (err.name === 'ValidationError' || err.name === 'ValidatorError') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Erreur de validation',
          type: 'validation_error',
          details: err.details || err.message,
          status: 400
        }
      });
    }

    // Si c'est une erreur JWT
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Session expirée ou invalide',
          type: 'auth_error',
          code: 'invalid_token',
          status: 401
        }
      });
    }

    // Si c'est une erreur HTTP standard ou une erreur Supabase
    if (isHttpError(err) || isSupabaseError) {
      let errorDetails = isSupabaseError ? getSupabaseErrorMessage(err) : {};
      
      const status = err.status || errorDetails.status || 500;
      const response = {
        success: false,
        error: {
          message: errorDetails.message || errorMessage,
          type: errorDetails.type || 'api_error',
          code: err.code || errorDetails.code || 'unexpected_error',
          status: status
        }
      };

      // Ajouter des détails supplémentaires si disponibles
      if (err.details) response.error.details = err.details;
      if (err.action) response.error.action = err.action;
      if (err.email) response.error.email = err.email;
      
      // En mode développement, ajouter plus de détails
      if (process.env.NODE_ENV === 'development') {
        response.error.stack = errorStack;
        if (err.originalError) {
          response.error.originalError = err.originalError;
        }
      }

      return res.status(status).json(response);
    }

    // Pour toutes les autres erreurs
    const errorResponse = {
      success: false,
      error: {
        message: 'Une erreur inattendue est survenue',
        type: 'server_error',
        status: 500
      }
    };

    // En mode développement, ajouter plus de détails
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error = {
        ...errorResponse.error,
        message: errorMessage,
        stack: errorStack,
        originalError: err.message
      };
    }

    res.status(500).json(errorResponse);
  } catch (error) {
    console.error('Erreur dans le gestionnaire d\'erreurs:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Une erreur interne est survenue',
        ...(process.env.NODE_ENV === 'development' && { 
          originalError: error.message,
          stack: error.stack
        })
      }
    });
  }
};

// Middleware pour gérer les routes non trouvées
exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
