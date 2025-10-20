require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createServer } = require('http');
const logger = require('./src/utils/logger');
const { notFound, errorHandler } = require('./src/middleware/error.middleware');

// Initialisation de l'application Express
const app = express();

// Middleware
// Configuration CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002', // Frontend port
  'http://localhost:5001',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de vérification du dépôt initial
const requireInitialDeposit = require('./src/middleware/requireInitialDeposit.middleware');

// Routes publiques
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/initial-deposit', require('./src/routes/initialDeposit.routes'));

// Routes protégées nécessitant un dépôt initial
app.use('/api/users', requireInitialDeposit, require('./src/routes/user.routes'));
app.use('/api/transactions', requireInitialDeposit, require('./src/routes/transaction.routes'));
app.use('/api/investments', requireInitialDeposit, require('./src/routes/investment.routes'));
app.use('/api/referrals', requireInitialDeposit, require('./src/routes/referral.routes'));
app.use('/api/dashboard', requireInitialDeposit, require('./src/routes/dashboard.routes'));

// Gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Créer le serveur HTTP
const httpServer = createServer(app);

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Démarrer le serveur
const PORT = process.env.PORT || 5001;
const server = httpServer.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  logger.info(`CORS allowed origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});

// Gestion de l'arrêt propre du serveur
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  // Gestion des erreurs d'écoute
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Gestion de l'arrêt propre du serveur
function shutdown() {
  logger.info('Shutting down server...');
  server.close(() => {
    logger.info('Server stopped');
    process.exit(0);
  });
}

// Gestion des signaux d'arrêt
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = server;
