import { z } from 'zod';
export declare class ValidationError extends Error {
    details?: any | undefined;
    constructor(message: string, details?: any | undefined);
}
export declare function validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T;
export declare function validateDateFormat(date: string): boolean;
export declare function validateAmount(amount: string): boolean;
export declare function formatAmount(amount: number): string;
export declare function parseAmount(amount: string): number;
export declare function validateRevisionNumber(revisionNumber: string): boolean;
export declare function sanitizeString(input: string): string;
export declare function validateEndUserId(endUserId: string): boolean;
export declare function validateQuickBooksId(id: string): boolean;
//# sourceMappingURL=validation.d.ts.map