const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');
const { upload } = require('../middleware/upload.middleware');

// Validation des données
const updateProfileValidation = [
  body('firstName').optional().trim().notEmpty().withMessage('First name is required'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name is required'),
  body('phone').optional().trim().isMobilePhone().withMessage('Invalid phone number'),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  body('address').optional().isObject().withMessage('Address must be an object')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const toggleTwoFactorValidation = [
  body('enabled')
    .isBoolean()
    .withMessage('Enabled flag must be a boolean')
];

// Routes protégées
router.use(authenticate);

// Obtenir le profil de l'utilisateur connecté
router.get('/me', userController.getUserProfile);

// Obtenir le profil d'un utilisateur par ID
router.get(
  '/:userId',
  [
    param('userId').isUUID().withMessage('Invalid user ID')
  ],
  validate,
  userController.getUserProfile
);

// Mettre à jour le profil
router.put(
  '/profile',
  validate(updateProfileValidation),
  userController.updateProfile
);

// Changer le mot de passe
router.patch(
  '/change-password',
  validate(changePasswordValidation),
  userController.changePassword
);

// Récupérer l'état de sécurité (2FA)
router.get(
  '/security',
  userController.getSecuritySettings
);

// Activer/Désactiver la 2FA
router.post(
  '/two-factor-authentication',
  validate(toggleTwoFactorValidation),
  userController.toggleTwoFactorAuth
);

// Télécharger une photo de profil
router.post(
  '/upload-avatar',
  upload.single('avatar'),
  userController.uploadAvatar
);

// Supprimer le compte
router.delete(
  '/delete-account',
  [
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  userController.deleteAccount
);

module.exports = router;
