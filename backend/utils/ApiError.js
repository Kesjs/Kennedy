class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }

  // Static method to create 400 Bad Request error
  static badRequest(message = 'Bad Request') {
    return new ApiError(message, 400);
  }

  // Static method to create 401 Unauthorized error
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(message, 401);
  }

  // Static method to create 403 Forbidden error
  static forbidden(message = 'Forbidden') {
    return new ApiError(message, 403);
  }

  // Static method to create 404 Not Found error
  static notFound(message = 'Resource not found') {
    return new ApiError(message, 404);
  }

  // Static method to create 409 Conflict error
  static conflict(message = 'Conflict') {
    return new ApiError(message, 409);
  }

  // Static method to create 422 Unprocessable Entity error
  static unprocessable(message = 'Unprocessable Entity') {
    return new ApiError(message, 422);
  }

  // Static method to create 500 Internal Server Error
  static internal(message = 'Internal Server Error') {
    return new ApiError(message, 500);
  }
}

module.exports = ApiError;
