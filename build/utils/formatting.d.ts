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
export declare function formatSuccessResponse(data: any, metadata?: any): FormattedResponse;
export declare function formatErrorResponse(error: string | Error, endUserId?: string): FormattedResponse;
export declare function formatPaginatedResponse(data: any[], hasMore: boolean, nextCursor?: string, totalCount?: number, endUserId?: string): FormattedResponse;
export declare function formatFinancialAmount(amount: string | number): string;
export declare function formatDate(date: string): string;
export declare function formatAccountSummary(account: any): string;
export declare function formatBillSummary(bill: any): string;
export declare function formatPaymentSummary(payment: any): string;
export declare function formatVendorSpending(vendor: string, totalSpent: number, billCount: number, paymentCount: number): string;
export declare function truncateText(text: string, maxLength?: number): string;
export declare function formatListResponse<T>(items: T[], formatter: (item: T) => string, title?: string): string;
//# sourceMappingURL=formatting.d.ts.map