const { createClient } = require('@supabase/supabase-js');
const createError = require('http-errors');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
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
        emailRedirectTo: `${process.env.FRONTEND_URL}/auth/verify-email`
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw createError(401, 'Email ou mot de passe incorrect');
      }
      throw createError(500, 'Erreur de connexion: ' + error.message);
    }

    // Vérifier si l'email est vérifié
    if (!data.user.email_confirmed_at) {
      return res.status(403).json({
        success: false,
        message: 'Veuillez vérifier votre adresse email avant de vous connecter.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      session: data.session
    });
  } catch (error) {
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

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Vérification d'email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token_hash, type } = req.query;
    
    if (!token_hash || !type) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/verify-email?error=invalid_token`);
    }

    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type === 'email' ? 'signup' : type
    });

    if (error) {
      console.error('Erreur de vérification:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/auth/verify-email?error=verification_failed`);
    }

    // Mettre à jour le statut de vérification
    const { error: updateError } = await supabase.auth.updateUser({
      data: { is_verified: true }
    });

    if (updateError) {
      console.error('Erreur de mise à jour du profil:', updateError);
    }

    return res.redirect(`${process.env.FRONTEND_URL}/auth/verify-email?success=true`);
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/auth/verify-email?error=server_error`);
  }
};

// Fonction utilitaire pour générer un code de parrainage
function generateReferralCode(email) {
  return email.split('@')[0] + Math.random().toString(36).substring(2, 8);
}
