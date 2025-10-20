const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    logger.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected successfully'.green.bold);
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`.red.bold);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected'.yellow.bold);
});

// Close the Mongoose connection when the Node process ends
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed through app termination'.red.bold);
  process.exit(0);
});

module.exports = connectDB;
