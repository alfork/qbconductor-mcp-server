export declare class ConductorError extends Error {
    statusCode?: number | undefined;
    code?: string | undefined;
    details?: any | undefined;
    constructor(message: string, statusCode?: number | undefined, code?: string | undefined, details?: any | undefined);
}
export declare class QuickBooksConnectionError extends ConductorError {
    constructor(message?: string);
}
export declare class AuthenticationError extends ConductorError {
    constructor(message?: string);
}
export declare class PermissionError extends ConductorError {
    constructor(message?: string);
}
export declare class NotFoundError extends ConductorError {
    constructor(message?: string);
}
export declare class ConflictError extends ConductorError {
    constructor(message?: string);
}
export declare class RateLimitError extends ConductorError {
    constructor(message?: string);
}
export declare function handleApiError(error: any): never;
export declare function withErrorHandling<T extends any[], R>(fn: (...args: T) => Promise<R>): (...args: T) => Promise<R>;
export declare function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries?: number, baseDelay?: number): Promise<T>;
export declare function isRetryableError(error: any): boolean;
//# sourceMappingURL=error-handling.d.ts.map