const { createError } = require('http-errors');
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

// Stockage en mémoire pour les réglages 2FA (fallback pour l'environnement de dev)
const twoFactorStore = new Map();

const generateBackupCodes = (count = 10) => {
  return Array.from({ length: count }, () =>
    Array.from({ length: 4 }, () => Math.floor(Math.random() * 9000 + 1000)).join('-')
  );
};

// Obtenir le profil d'un utilisateur
exports.getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        first_name,
        last_name,
        phone,
        avatar_url,
        is_verified,
        created_at,
        updated_at,
        profile:profiles(
          date_of_birth,
          address,
          kyc_status,
          kyc_data
        )
      `)
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw createError(404, 'User not found');
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Mettre à jour le profil utilisateur
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, phone, dateOfBirth, address } = req.body;

    // Mettre à jour la table users
    const { data: updatedUser, error: userError } = await supabase
      .from('users')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (userError) throw userError;

    // Mettre à jour ou créer le profil dans la table profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        date_of_birth: dateOfBirth || null,
        address: address || null,
        updated_at: new Date().toISOString()
      });

    if (profileError) throw profileError;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// Changer le mot de passe
exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    // Vérifier l'ancien mot de passe
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw createError(404, 'User not found');
    }

    if (!user.password_hash) {
      throw createError(400, 'Password change is not available for this account type');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      throw createError(400, 'Current password is incorrect');
    }

    // Mettre à jour le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Activer/désactiver l'authentification à deux facteurs
exports.toggleTwoFactorAuth = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { enabled } = req.body;

    if (typeof enabled !== 'boolean') {
      throw createError(400, 'Enabled flag must be a boolean');
    }

    let backupCodes = [];

    if (enabled) {
      backupCodes = generateBackupCodes();
      twoFactorStore.set(userId, {
        enabled: true,
        backupCodes,
        updatedAt: new Date().toISOString()
      });
    } else {
      twoFactorStore.set(userId, {
        enabled: false,
        backupCodes: [],
        updatedAt: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: {
        twoFactorAuth: enabled,
        backupCodes
      }
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer l'état de sécurité de l'utilisateur
exports.getSecuritySettings = async (req, res, next) => {
  try {
    const userId = req.userId;
    const settings = twoFactorStore.get(userId) || {
      enabled: false,
      backupCodes: []
    };

    res.json({
      success: true,
      data: {
        twoFactorAuth: settings.enabled,
        backupCodes: settings.backupCodes
      }
    });
  } catch (error) {
    next(error);
  }
};

// Télécharger une photo de profil
exports.uploadAvatar = async (req, res, next) => {
  try {
    const userId = req.userId;
    
    if (!req.file) {
      throw createError(400, 'No file uploaded');
    }

    // Télécharger le fichier vers Supabase Storage
    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `avatars/${userId}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file.buffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.mimetype
      });

    if (uploadError) throw uploadError;

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Mettre à jour l'URL de l'avatar dans la base de données
    const { error: updateError } = await supabase
      .from('users')
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatarUrl: publicUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer le compte utilisateur
exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { password } = req.body;

    // Vérifier le mot de passe
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw createError(404, 'User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw createError(400, 'Password is incorrect');
    }

    // Supprimer l'utilisateur (CASCADE supprimera automatiquement les enregistrements liés)
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (deleteError) throw deleteError;

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
