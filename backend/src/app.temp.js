require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { join } = require('path');
const { logger } = require('./utils/logger');
const { errorHandler, notFound } = require('./middleware/error.middleware');
const { handleUploadErrors } = require('./middleware/upload.middleware');

// Initialisation de l'application Express
const app = express();

// Middleware de base
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Journalisation des requêtes en développement
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Point de contrôle de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Gazoduc Invest API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes API
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/investments', require('./routes/investment.routes'));
app.use('/api/transactions', require('./routes/transaction.routes'));
app.use('/api/referrals', require('./routes/referral.routes'));

// Gestion des erreurs de téléchargement
app.use(handleUploadErrors);

// Gestionnaire de routes non trouvées
app.use(notFound);

// Gestionnaire d'erreurs global
app.use(errorHandler);

module.exports = app;
