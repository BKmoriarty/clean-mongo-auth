import type {Request, Response, NextFunction} from 'express';
import {AppError} from '../utils/errors';
import {ZodError} from 'zod';
import mongoose from 'mongoose';
import {logError} from '../utils/logger';

interface ErrorResponse {
  status: string;
  message: string;
  code?: string;
  errors?: any[];
  stack?: string;
}

const handleZodError = (err: ZodError): ErrorResponse => ({
  status: 'fail',
  message: 'Validation error',
  errors: err.errors.map(e => ({
    field: e.path.join('.'),
    message: e.message,
    code: e.code,
  })),
});

const handleMongoError = (err: mongoose.mongo.MongoError): ErrorResponse => {
  // Handle specific MongoDB errors
  switch (err.code) {
    case 11000: // Duplicate key error
      return {
        status: 'fail',
        message: 'Duplicate entry',
        code: 'DUPLICATE_ENTRY',
      };
    default:
      return {
        status: 'error',
        message: 'Database error',
        code: 'DB_ERROR',
      };
  }
};

const handleMongooseError = (err: mongoose.Error): ErrorResponse => {
  if (err instanceof mongoose.Error.ValidationError) {
    return {
      status: 'fail',
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message,
        code: e.kind,
      })),
    };
  }

  if (err instanceof mongoose.Error.CastError) {
    return {
      status: 'fail',
      message: 'Invalid ID format',
      code: 'INVALID_ID',
    };
  }

  if (err instanceof mongoose.Error.DocumentNotFoundError) {
    return {
      status: 'fail',
      message: 'Resource not found',
      code: 'NOT_FOUND',
    };
  }

  return {
    status: 'error',
    message: 'Database error',
    code: 'DB_ERROR',
  };
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  // Log error details
  logError(err, req);

  let errorResponse: ErrorResponse;
  let statusCode = 500;

  // Handle different types of errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorResponse = {
      status: err.status,
      message: err.message,
      code: err.name,
    };
  } else if (err instanceof ZodError) {
    statusCode = 400;
    errorResponse = handleZodError(err);
  } else if (err instanceof mongoose.mongo.MongoError) {
    statusCode = err.code === 11000 ? 409 : 500;
    errorResponse = handleMongoError(err);
  } else if (err instanceof mongoose.Error) {
    statusCode =
      err instanceof mongoose.Error.ValidationError
        ? 400
        : err instanceof mongoose.Error.DocumentNotFoundError
          ? 404
          : err instanceof mongoose.Error.CastError
            ? 400
            : 500;
    errorResponse = handleMongooseError(err);
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorResponse = {
      status: 'fail',
      message: 'Token has expired',
      code: 'TOKEN_EXPIRED',
    };
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorResponse = {
      status: 'fail',
      message: 'Invalid token',
      code: 'INVALID_TOKEN',
    };
  } else {
    // Unknown error
    statusCode = 500;
    errorResponse = {
      status: 'error',
      message: 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR',
    };
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};
