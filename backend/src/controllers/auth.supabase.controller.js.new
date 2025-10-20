const { createClient } = require('@supabase/supabase-js');
const createError = require('http-errors');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);

// Inscription d'un nouvel utilisateur
exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, referralCode } = req.body;

    // Créer l'utilisateur avec Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || '',
          referral_code: generateReferralCode(email),
          is_verified: false
        },
        emailRedirectTo: 'http://localhost:3000/auth/callback'
      }
    });

    if (error) {
      console.error('Erreur Supabase Auth:', error);
      if (error.message.includes('already registered')) {
        throw createError(400, 'Cet email est déjà enregistré');
      }
      throw createError(500, "Erreur lors de l'inscription: " + error.message);
    }

    res.status(201).json({
      success: true,
      message: 'Inscription réussie. Veuillez vérifier votre email.',
      user: data.user
    });
  } catch (error) {
    next(error);
  }
};

// Connexion de l'utilisateur
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation des entrées
    if (!email || !password) {
      return next({
        status: 400,
        code: 'missing_credentials',
        message: 'Email et mot de passe sont requis',
        __isAuthError: true
      });
    }

    // Nettoyage des entrées
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Tentative de connexion
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });

    // Gestion des erreurs de connexion
    if (error) {
      console.error('Erreur de connexion Supabase:', error);
      
      // Mapper les erreurs spécifiques de Supabase
      let errorDetails = {
        status: 400,
        code: 'authentication_error',
        message: 'Erreur lors de la connexion',
        __isAuthError: true
      };

      if (error.message.includes('Invalid login credentials')) {
        errorDetails = {
          status: 401,
          code: 'invalid_credentials',
          message: 'Email ou mot de passe incorrect',
          __isAuthError: true
        };
      } else if (error.message.includes('Email not confirmed')) {
        errorDetails = {
          status: 403,
          code: 'email_not_confirmed',
          message: 'Veuillez vérifier votre adresse email avant de vous connecter.',
          __isAuthError: true
        };
      } else if (error.message.includes('Email rate limit exceeded')) {
        errorDetails = {
          status: 429,
          code: 'too_many_requests',
          message: 'Trop de tentatives. Veuillez réessayer plus tard.',
          __isAuthError: true
        };
      }

      return next(errorDetails);
    }

    // Vérification de la session
    if (!data?.session) {
      console.error('Aucune session retournée par Supabase:', data);
      return next({
        status: 500,
        code: 'session_error',
        message: 'Erreur lors de la création de la session',
        __isAuthError: true
      });
    }

    // Créer l'objet utilisateur avec toutes les propriétés nécessaires
    const userData = {
      id: data.user.id,
      email: data.user.email,
      firstName: data.user.user_metadata?.first_name,
      lastName: data.user.user_metadata?.last_name,
      isVerified: !!data.user.email_confirmed_at,
      email_verified: !!data.user.email_confirmed_at,
      // Ajouter d'autres champs utilisateur si nécessaire
    };

    // Mettre à jour les métadonnées de l'utilisateur si nécessaire
    if (!data.user.user_metadata) {
      await supabase.auth.updateUser({
        data: {
          ...data.user.user_metadata,
          email_verified: !!data.user.email_confirmed_at
        }
      });
    }

    // Si l'email n'est pas vérifié, renvoyer une erreur avec les détails de l'utilisateur
    if (!data.user.email_confirmed_at) {
      return next({
        status: 403,
        code: 'email_not_verified',
        message: 'Veuillez vérifier votre adresse email avant de vous connecter. Vérifiez votre boîte de réception ou cliquez sur le bouton ci-dessous pour recevoir un nouvel email de vérification.',
        __isAuthError: true,
        action: 'resend_verification',
        email: data.user?.email,
        user: userData  // Inclure les données utilisateur dans la réponse d'erreur
      });
    }

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      user: userData,
      token: data.session.access_token,
      refreshToken: data.session.refresh_token
    });
  } catch (error) {
    console.error('Erreur inattendue lors de la connexion:', error);
    next(error);
  }
};

// Déconnexion
exports.logout = async (req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    next(createError(500, 'Erreur lors de la déconnexion'));
  }
};

// Récupérer l'utilisateur actuel
exports.getMe = async (req, res, next) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      throw createError(401, 'Non autorisé');
    }

    // Créer l'objet utilisateur avec toutes les propriétés nécessaires
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.user_metadata?.first_name,
      lastName: user.user_metadata?.last_name,
      isVerified: !!user.email_confirmed_at,
      email_verified: !!user.email_confirmed_at,
      // Ajouter d'autres champs utilisateur si nécessaire
    };

    res.status(200).json({
      success: true,
      user: userData
    });
  } catch (error) {
    next(error);
  }
};

// Fonction utilitaire pour générer un code de parrainage
function generateReferralCode(email) {
  return email.split('@')[0] + Math.random().toString(36).substring(2, 8);
}
