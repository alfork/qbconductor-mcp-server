import { logger } from '../logger.js';

export interface FormattedResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    totalCount?: number;
    hasMore?: boolean;
    nextCursor?: string;
    endUserId?: string;
    timestamp?: string;
  };
}

export function formatSuccessResponse(data: any, metadata?: any): FormattedResponse {
  return {
    success: true,
    data,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  };
}

export function formatErrorResponse(error: string | Error, endUserId?: string): FormattedResponse {
  const errorMessage = error instanceof Error ? error.message : error;
  
  logger.error('Formatting error response', { error: errorMessage, endUserId });
  
  return {
    success: false,
    error: errorMessage,
    metadata: {
      endUserId,
      timestamp: new Date().toISOString(),
    },
  };
}

export function formatPaginatedResponse(
  data: any[],
  hasMore: boolean,
  nextCursor?: string,
  totalCount?: number,
  endUserId?: string
): FormattedResponse {
  return formatSuccessResponse(data, {
    totalCount: totalCount || data.length,
    hasMore,
    nextCursor,
    endUserId,
  });
}

export function formatFinancialAmount(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatDate(date: string): string {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return date;
  }
}

export function formatAccountSummary(account: any): string {
  const balance = formatFinancialAmount(account.balance || '0');
  const status = account.isActive ? 'Active' : 'Inactive';
  
  return `${account.fullName} (${account.accountType}) - Balance: ${balance} - Status: ${status}`;
}

export function formatBillSummary(bill: any): string {
  const amount = formatFinancialAmount(bill.totalAmount || '0');
  const date = formatDate(bill.transactionDate);
  const status = bill.isPaid ? 'Paid' : 'Unpaid';
  
  return `Bill ${bill.refNumber || bill.id} from ${bill.vendor?.fullName || 'Unknown'} - ${amount} - ${date} - ${status}`;
}

export function formatPaymentSummary(payment: any): string {
  const amount = formatFinancialAmount(payment.totalAmount || '0');
  const date = formatDate(payment.transactionDate);
  const method = payment.objectType === 'qbd_bill_check_payment' ? 'Check' : 'Credit Card';
  
  return `${method} Payment ${payment.refNumber || payment.id} to ${payment.payee?.fullName || 'Unknown'} - ${amount} - ${date}`;
}

export function formatVendorSpending(vendor: string, totalSpent: number, billCount: number, paymentCount: number): string {
  const amount = formatFinancialAmount(totalSpent);
  return `${vendor}: ${amount} total (${billCount} bills, ${paymentCount} payments)`;
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function formatListResponse<T>(
  items: T[],
  formatter: (item: T) => string,
  title: string = 'Results'
): string {
  if (items.length === 0) {
    return `No ${title.toLowerCase()} found.`;
  }
  
  const formatted = items.map((item, index) => `${index + 1}. ${formatter(item)}`).join('\n');
  return `${title} (${items.length} found):\n${formatted}`;
}
