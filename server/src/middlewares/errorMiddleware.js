import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    error = new ApiError(404, message);
  }

  // Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const message = `Duplicate value entered for '${field}'. Please use another value.`;
    error = new ApiError(400, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = new ApiError(400, message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid authentication token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Authentication token has expired');
  }

  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
    errors: error.errors || [],
  };

  // Only expose stack traces in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
