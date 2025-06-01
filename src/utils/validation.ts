import { z } from 'zod';
import { logger } from '../logger.js';

export class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      }).join(', ');
      
      logger.warn('Input validation failed', { errors: error.errors, input });
      throw new ValidationError(`Validation failed: ${errorMessages}`, error.errors);
    }
    throw error;
  }
}

export function validateDateFormat(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export function validateAmount(amount: string): boolean {
  return /^\d+(\.\d{1,2})?$/.test(amount) && parseFloat(amount) >= 0;
}

export function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

export function parseAmount(amount: string): number {
  const parsed = parseFloat(amount);
  if (isNaN(parsed) || parsed < 0) {
    throw new ValidationError(`Invalid amount: ${amount}`);
  }
  return parsed;
}

export function validateRevisionNumber(revisionNumber: string): boolean {
  return /^\d+$/.test(revisionNumber);
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function validateEndUserId(endUserId: string): boolean {
  return /^end_usr_[a-zA-Z0-9]+$/.test(endUserId);
}

export function validateQuickBooksId(id: string): boolean {
  return /^[a-zA-Z0-9\-]+$/.test(id) && id.length > 0;
}
