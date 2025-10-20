const { validationResult } = require('express-validator');
const { createError } = require('http-errors');

// Middleware pour gérer la validation des données
exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    throw createError(400, 'Validation failed', { errors: errorMessages });
  };
};
