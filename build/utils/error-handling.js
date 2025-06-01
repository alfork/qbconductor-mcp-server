import { logger } from '../logger.js';
import { ValidationError } from './validation.js';
export class ConductorError extends Error {
    statusCode;
    code;
    details;
    constructor(message, statusCode, code, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = 'ConductorError';
    }
}
export class QuickBooksConnectionError extends ConductorError {
    constructor(message = 'QuickBooks Desktop is not connected or not responding') {
        super(message, 502, 'QB_CONNECTION_ERROR');
    }
}
export class AuthenticationError extends ConductorError {
    constructor(message = 'Authentication failed') {
        super(message, 401, 'AUTH_ERROR');
    }
}
export class PermissionError extends ConductorError {
    constructor(message = 'Access denied') {
        super(message, 403, 'PERMISSION_ERROR');
    }
}
export class NotFoundError extends ConductorError {
    constructor(message = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
    }
}
export class ConflictError extends ConductorError {
    constructor(message = 'Resource conflict') {
        super(message, 409, 'CONFLICT_ERROR');
    }
}
export class RateLimitError extends ConductorError {
    constructor(message = 'Rate limit exceeded') {
        super(message, 429, 'RATE_LIMIT_ERROR');
    }
}
export function handleApiError(error) {
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
export function withErrorHandling(fn) {
    return async (...args) => {
        try {
            return await fn(...args);
        }
        catch (error) {
            if (error instanceof ValidationError ||
                error instanceof ConductorError) {
                throw error;
            }
            return handleApiError(error);
        }
    };
}
export function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    return new Promise(async (resolve, reject) => {
        let lastError = new Error('Unknown error');
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const result = await fn();
                resolve(result);
                return;
            }
            catch (error) {
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
export function isRetryableError(error) {
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
//# sourceMappingURL=error-handling.js.map