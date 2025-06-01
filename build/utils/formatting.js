import { logger } from '../logger.js';
export function formatSuccessResponse(data, metadata) {
    return {
        success: true,
        data,
        metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
        },
    };
}
export function formatErrorResponse(error, endUserId) {
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
export function formatPaginatedResponse(data, hasMore, nextCursor, totalCount, endUserId) {
    return formatSuccessResponse(data, {
        totalCount: totalCount || data.length,
        hasMore,
        nextCursor,
        endUserId,
    });
}
export function formatFinancialAmount(amount) {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(num);
}
export function formatDate(date) {
    try {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
    catch {
        return date;
    }
}
export function formatAccountSummary(account) {
    const balance = formatFinancialAmount(account.balance || '0');
    const status = account.isActive ? 'Active' : 'Inactive';
    return `${account.fullName} (${account.accountType}) - Balance: ${balance} - Status: ${status}`;
}
export function formatBillSummary(bill) {
    const amount = formatFinancialAmount(bill.totalAmount || '0');
    const date = formatDate(bill.transactionDate);
    const status = bill.isPaid ? 'Paid' : 'Unpaid';
    return `Bill ${bill.refNumber || bill.id} from ${bill.vendor?.fullName || 'Unknown'} - ${amount} - ${date} - ${status}`;
}
export function formatPaymentSummary(payment) {
    const amount = formatFinancialAmount(payment.totalAmount || '0');
    const date = formatDate(payment.transactionDate);
    const method = payment.objectType === 'qbd_bill_check_payment' ? 'Check' : 'Credit Card';
    return `${method} Payment ${payment.refNumber || payment.id} to ${payment.payee?.fullName || 'Unknown'} - ${amount} - ${date}`;
}
export function formatVendorSpending(vendor, totalSpent, billCount, paymentCount) {
    const amount = formatFinancialAmount(totalSpent);
    return `${vendor}: ${amount} total (${billCount} bills, ${paymentCount} payments)`;
}
export function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength - 3) + '...';
}
export function formatListResponse(items, formatter, title = 'Results') {
    if (items.length === 0) {
        return `No ${title.toLowerCase()} found.`;
    }
    const formatted = items.map((item, index) => `${index + 1}. ${formatter(item)}`).join('\n');
    return `${title} (${items.length} found):\n${formatted}`;
}
//# sourceMappingURL=formatting.js.map