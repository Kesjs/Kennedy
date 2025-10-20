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
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', require('./src/routes/user.routes'));

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
const PORT = process.env.PORT || 10000;
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
