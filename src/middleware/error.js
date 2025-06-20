import { config } from '../config/index.js';

class ErrorResponse extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

const errorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  COMPETITION_ERROR: 'COMPETITION_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  SERVER_ERROR: 'SERVER_ERROR'
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.errorCode = err.errorCode;

  // Log error details in development
  if (config.env === 'development') {
    console.error({
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
      timestamp: new Date().toISOString()
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new ErrorResponse('Resource not found', 404, errorTypes.NOT_FOUND);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ErrorResponse(
      `Duplicate value entered for ${field} field`,
      400,
      errorTypes.VALIDATION_ERROR
    );
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(
      messages.join('. '),
      400,
      errorTypes.VALIDATION_ERROR
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ErrorResponse(
      'Invalid authentication token',
      401,
      errorTypes.AUTHENTICATION_ERROR
    );
  }

  if (err.name === 'TokenExpiredError') {
    error = new ErrorResponse(
      'Authentication token expired',
      401,
      errorTypes.AUTHENTICATION_ERROR
    );
  }

  // Competition specific errors
  if (err.message.includes('competition')) {
    error.errorCode = errorTypes.COMPETITION_ERROR;
  }

  // Database connection errors
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    error = new ErrorResponse(
      'Database operation failed',
      500,
      errorTypes.DATABASE_ERROR
    );
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    errorCode: error.errorCode || errorTypes.SERVER_ERROR,
    ...(config.env === 'development' && {
      stack: err.stack,
      details: err
    })
  });
};

export { ErrorResponse, errorTypes, errorHandler as default }; 