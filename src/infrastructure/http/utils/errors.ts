export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public status: string = 'error',
    public isOperational: boolean = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'fail');
    this.name = 'ValidationError';
  }
}

export class UUIDError extends AppError {
  constructor(message = 'Invalid UUID') {
    super(message, 400, 'fail');
    this.name = 'UUIDError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'fail');
    this.name = 'NotFoundError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500, 'error', false);
    this.name = 'DatabaseError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'fail');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Not authorized to access this resource') {
    super(message, 403, 'fail');
    this.name = 'AuthorizationError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message + ' already exists', 409, 'fail');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429, 'fail');
    this.name = 'RateLimitError';
  }
}

export const isOperationalError = (error: Error): boolean => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};
