import { logger } from '../logger.js';
import { ValidationError } from './validation.js';

export class ConductorError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ConductorError';
  }
}

export class QuickBooksConnectionError extends ConductorError {
  constructor(message: string = 'QuickBooks Desktop is not connected or not responding') {
    super(message, 502, 'QB_CONNECTION_ERROR');
  }
}

export class AuthenticationError extends ConductorError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR');
  }
}

export class PermissionError extends ConductorError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'PERMISSION_ERROR');
  }
}

export class NotFoundError extends ConductorError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends ConductorError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

export class RateLimitError extends ConductorError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

export function handleApiError(error: any): never {
  logger.error('API error occurred', {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    stack: error.stack,
  });

  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || error.message || 'Unknown API error';

    switch (status) {
      case 400:
        throw new ValidationError(`Bad request: ${message}`, data);
      case 401:
        throw new AuthenticationError(message);
      case 403:
        throw new PermissionError(message);
      case 404:
        throw new NotFoundError(message);
      case 409:
        throw new ConflictError(message);
      case 429:
        throw new RateLimitError(message);
      case 502:
      case 503:
      case 504:
        throw new QuickBooksConnectionError(message);
      default:
        throw new ConductorError(message, status, data?.code, data);
    }
  }

  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    throw new ConductorError('Network connection failed. Please check your internet connection.');
  }

  if (error.code === 'ETIMEDOUT') {
    throw new ConductorError('Request timed out. The API may be experiencing issues.');
  }

  throw new ConductorError(error.message || 'Unknown error occurred');
}

export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof ValidationError || 
          error instanceof ConductorError) {
        throw error;
      }
      return handleApiError(error);
    }
  };
}

export function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    let lastError: Error = new Error('Unknown error');

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fn();
        resolve(result);
        return;
      } catch (error: any) {
        lastError = error;

        if (error instanceof ValidationError || 
            error instanceof AuthenticationError ||
            error instanceof PermissionError ||
            error instanceof NotFoundError) {
          reject(error);
          return;
        }

        if (attempt === maxRetries) {
          break;
        }

        const delay = baseDelay * Math.pow(2, attempt);
        logger.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms`, {
          error: error.message,
          attempt: attempt + 1,
          maxRetries,
        });

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    reject(lastError);
  });
}

export function isRetryableError(error: any): boolean {
  if (error instanceof QuickBooksConnectionError ||
      error instanceof RateLimitError) {
    return true;
  }

  if (error.code === 'ECONNREFUSED' || 
      error.code === 'ENOTFOUND' || 
      error.code === 'ETIMEDOUT') {
    return true;
  }

  if (error.response?.status >= 500) {
    return true;
  }

  return false;
}
