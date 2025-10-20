const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const authController = require('../controllers/auth.supabase.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Routes d'authentification
router.post('/register', 
  validate([
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').notEmpty(),
    body('lastName').notEmpty()
  ]),
  authController.register
);

router.post('/login', 
  validate([
    body('email').isEmail(),
    body('password').exists()
  ]),
  authController.login
);

router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);

module.exports = router;