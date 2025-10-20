const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const supabase = require('../config/supabase');
const RefreshToken = require('../models/refreshToken.model');
const crypto = require('crypto');

// Durées d'expiration (en secondes)
const ACCESS_TOKEN_EXPIRES_IN = 3600; // 1 heure
const REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 7; // 7 jours

// Constantes pour la limitation des tentatives de connexion
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Cache pour suivre les tentatives de connexion (à remplacer par Redis en production)
const loginAttempts = new Map();

/**
 * Vérifie et met à jour le nombre de tentatives de connexion
 * @param {string} email - L'email de l'utilisateur
 * @returns {number} Le nombre de tentatives actuelles
 */
async function checkAndUpdateLoginAttempts(email) {
  const now = Date.now();
  const attempt = loginAttempts.get(email) || { count: 0, firstAttempt: now };
  
  // Réinitialiser le compteur si la période de verrouillage est écoulée
  if (now - attempt.firstAttempt > LOCKOUT_DURATION) {
    attempt.count = 0;
    attempt.firstAttempt = now;
  }
  
  attempt.count++;
  loginAttempts.set(email, attempt);
  
  // Nettoyer les anciennes entrées (pour éviter une fuite de mémoire)
  for (const [key, value] of loginAttempts.entries()) {
    if (now - value.firstAttempt > LOCKOUT_DURATION * 2) {
      loginAttempts.delete(key);
    }
  }
  
  return attempt.count;
}

// Inscription d'un nouvel utilisateur
exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, referralCode } = req.body;

    // Valider les données d'entrée
    if (!email || !password) {
      throw createError(400, 'Email et mot de passe sont requis');
    }

    // Créer l'utilisateur avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          referral_code: generateReferralCode(email)
        },
        emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback`
      }
    });

    if (authError) {
      console.error('Erreur Supabase Auth:', authError);
      if (authError.message.includes('already registered')) {
        throw createError(400, 'Cet email est déjà enregistré');
      }
      throw createError(500, "Erreur lors de la création de l'utilisateur: " + authError.message);
    }

    if (!authData.user) {
      throw createError(500, "Erreur lors de la création de l'utilisateur");
    }

    // Gérer le code de parrainage si fourni
    if (referralCode) {
      await handleReferral(referralCode, authData.user.id);
    }

    // Générer les tokens
    const accessToken = generateToken(authData.user.id);
    const refreshToken = await generateRefreshToken(authData.user.id);
    
    // Ne pas renvoyer les données sensibles
    const userResponse = {
      id: authData.user.id,
      email: authData.user.email,
      email_confirmed: !!authData.user.email_confirmed_at,
      created_at: authData.user.created_at,
      ...authData.user.user_metadata
    };

    res.status(201).json({
      success: true,
      message: 'Inscription réussie. Veuillez vérifier votre email.',
      user: userResponse,
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    });
  } catch (error) {
    next(error);
  }
};

// Connexion de l'utilisateur
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userIp = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'inconnu';
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();

    // 1. Validation des entrées
    if (!trimmedEmail || !trimmedPassword) {
      throw createError(400, 'Email et mot de passe sont requis');
    }

    // Validation du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw createError(400, 'Format d\'email invalide');
    }

    // Vérification des tentatives de connexion
    const attempts = await checkAndUpdateLoginAttempts(trimmedEmail);
    if (attempts > MAX_LOGIN_ATTEMPTS) {
      const remainingTime = Math.ceil((LOCKOUT_DURATION - (Date.now() - loginAttempts.get(trimmedEmail).firstAttempt)) / 60000);
      throw createError(429, `Trop de tentatives de connexion. Réessayez dans ${remainingTime} minutes.`);
    }

    // Journalisation de la tentative de connexion
    console.log(`Tentative de connexion - Email: ${trimmedEmail}, IP: ${userIp}, User-Agent: ${userAgent}`);

    // 2. Authentification avec Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword
    });

    if (authError) {
      console.error('Erreur d\'authentification:', {
        email: trimmedEmail,
        error: authError.message,
        ip: userIp,
        userAgent,
        timestamp: new Date().toISOString()
      });
      
      // Gestion des erreurs spécifiques
      if (authError.message.includes('Invalid login credentials')) {
        throw createError(401, `Identifiants invalides. Tentatives restantes: ${MAX_LOGIN_ATTEMPTS - attempts}`);
      } else if (authError.message.includes('Email not confirmed')) {
        throw createError(403, 'Veuillez confirmer votre adresse email avant de vous connecter');
      } else if (authError.message.includes('too many requests')) {
        throw createError(429, 'Trop de tentatives de connexion. Veuillez réessayer plus tard.');
      } else {
        throw createError(500, 'Erreur lors de la connexion');
      }
    }

    if (!authData.user) {
      throw createError(500, 'Erreur lors de la récupération des données utilisateur');
    }

    // Réinitialiser le compteur de tentatives en cas de succès
    loginAttempts.delete(trimmedEmail);

    // 3. Vérification de l'email vérifié
    if (!authData.user.email_confirmed_at) {
      console.warn(`Tentative de connexion avec email non vérifié: ${trimmedEmail}`);
      // Optionnel : forcer la vérification de l'email
      // throw createError(403, 'Veuillez vérifier votre adresse email avant de vous connecter');
    }

    // 4. Gestion des sessions actives (optionnel)
    try {
      const { data: sessions } = await supabase.auth.admin.listUserSessions(authData.user.id);
      if (sessions && sessions.length > 0) {
        console.log(`Utilisateur ${trimmedEmail} a déjà ${sessions.length} session(s) active(s)`);
        // Optionnel : déconnecter les autres sessions
        // await supabase.auth.admin.signOutUser(authData.user.id);
      }
    } catch (sessionError) {
      console.error('Erreur lors de la vérification des sessions:', sessionError);
      // Ne pas bloquer la connexion en cas d'erreur de session
    }

    // 5. Récupération ou création du profil utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Erreur lors de la récupération du profil:', profileError);
      throw createError(500, 'Erreur lors du chargement du profil utilisateur');
    }

    // 6. Mise à jour ou création du profil
    let userProfile = profile;
    if (!profile) {
      console.warn(`Création du profil pour l'utilisateur: ${authData.user.id}`);
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            first_name: authData.user.user_metadata?.first_name || '',
            last_name: authData.user.user_metadata?.last_name || '',
            phone: authData.user.user_metadata?.phone || '',
            is_verified: !!authData.user.email_confirmed_at,
            last_login: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (createError) {
        console.error('Erreur lors de la création du profil:', createError);
        throw createError(500, 'Erreur lors de la création du profil utilisateur');
      }
      
      userProfile = newProfile;
    } else {
      // Mise à jour de la dernière connexion
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          last_login: new Date().toISOString(),
          login_count: (userProfile.login_count || 0) + 1
        })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour de la dernière connexion:', updateError);
      }
    }

    // 7. Génération des tokens
    const accessToken = generateToken(authData.user.id);
    const refreshToken = await generateRefreshToken(authData.user.id);

    // 8. Préparation de la réponse
    const userResponse = {
      id: authData.user.id,
      email: authData.user.email,
      email_confirmed: !!authData.user.email_confirmed_at,
      created_at: authData.user.created_at,
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      role: userProfile.role || 'user',
      is_verified: userProfile.is_verified || false,
      // Ne pas renvoyer les champs sensibles
      password: undefined,
      updated_at: undefined
    };

    // 9. Journalisation de la connexion réussie
    console.log(`Connexion réussie - ID: ${authData.user.id}, Email: ${trimmedEmail}, IP: ${userIp}`);

    // 10. Envoi de la réponse
    res.json({
      success: true,
      message: 'Connexion réussie',
      user: userResponse,
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      session: {
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + ACCESS_TOKEN_EXPIRES_IN * 1000).toISOString()
      }
    });
  } catch (error) {
    console.error('Erreur dans la fonction de connexion:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Gestion des erreurs spécifiques
    if (error.status) {
      next(error);
    } else if (error.message.includes('JWT')) {
      next(createError(401, 'Session expirée. Veuillez vous reconnecter.'));
    } else if (error.message.includes('duplicate key')) {
      next(createError(409, 'Un compte avec cet email existe déjà'));
    } else {
      next(createError(500, 'Une erreur est survenue lors de la connexion'));
    }
  }
};

// Obtenir l'utilisateur actuel
exports.getMe = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (error || !user) {
      throw createError(404, 'User not found');
    }

    const { password_hash, ...userWithoutPassword } = user;
    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

// Fonction pour déconnecter l'utilisateur (révocation du refresh token)
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await RefreshToken.findOneAndUpdate(
        { token: refreshToken },
        { revoked: true }
      );
    }
    
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// Fonction utilitaire pour générer un token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { 
      id: userId,
      type: 'access'
    },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
};

// Fonction pour générer un refresh token
const generateRefreshToken = async (userId) => {
  // Créer un token aléatoire sécurisé
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + REFRESH_TOKEN_EXPIRES_IN);

  // Stocker le refresh token en base de données
  const refreshToken = await RefreshToken.create({
    token,
    userId,
    expiresAt
  });

  return token;
};

// Fonction pour rafraîchir un token
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw createError(400, 'Refresh token is required');
    }

    // Vérifier si le refresh token existe et n'est pas révoqué
    const storedToken = await RefreshToken.findOne({ 
      token: refreshToken,
      revoked: false,
      expiresAt: { $gt: new Date() }
    }).populate('userId');

    if (!storedToken) {
      throw createError(403, 'Invalid refresh token');
    }

    // Générer un nouveau token d'accès
    const accessToken = generateToken(storedToken.userId._id);

    // Optionnel : générer un nouveau refresh token (rotation des tokens)
    // const newRefreshToken = await generateRefreshToken(storedToken.userId._id);
    
    // Marquer l'ancien refresh token comme utilisé
    storedToken.revoked = true;
    await storedToken.save();

    res.json({
      accessToken,
      // refreshToken: newRefreshToken, // Si rotation des tokens activée
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    });
  } catch (error) {
    next(error);
  }
};

// Révocation d'un refresh token
exports.revokeRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw createError(400, 'Refresh token is required');
    }

    await RefreshToken.findOneAndUpdate(
      { token: refreshToken },
      { revoked: true }
    );

    res.json({ success: true, message: 'Refresh token revoked' });
  } catch (error) {
    next(error);
  }
};

// Fonction utilitaire pour générer un code de parrainage
function generateReferralCode(email) {
  return Buffer.from(email).toString('base64').substring(0, 8).toUpperCase();
}

// Fonction utilitaire pour gérer le parrainage
async function handleReferral(referralCode, referredUserId) {
  try {
    // Trouver l'utilisateur parrain
    const { data: referrer, error } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (referrer) {
      // Enregistrer le parrainage
      await supabase
        .from('referrals')
        .insert([
          {
            referrer_id: referrer.id,
            referred_id: referredUserId,
            status: 'active'
          }
        ]);
    }
  } catch (error) {
    console.error('Error handling referral:', error);
  }
}

