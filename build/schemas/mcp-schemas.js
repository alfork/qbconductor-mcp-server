import { z } from 'zod';
export const EndUserIdSchema = z.string().optional().describe('End-user ID to use for this operation. If not provided, uses the default configured end-user.');
export const PaginationSchema = z.object({
    limit: z.number().min(1).max(100).default(50).describe('Number of records to return (1-100)'),
    cursor: z.string().optional().describe('Cursor for pagination to get the next page of results'),
});
export const DateRangeSchema = z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('Start date in YYYY-MM-DD format'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('End date in YYYY-MM-DD format'),
});
export const CreateEndUserSchema = z.object({
    sourceId: z.string().optional().describe('Your internal ID for this end-user'),
    email: z.string().email().optional().describe('Email address of the end-user'),
    companyName: z.string().optional().describe('Company name for the end-user'),
});
export const CreateAuthSessionSchema = z.object({
    endUserId: z.string().describe('End-user ID to create auth session for'),
    redirectUrl: z.string().url().optional().describe('URL to redirect to after authentication'),
});
export const ListAccountsSchema = z.object({
    endUserId: EndUserIdSchema,
    accountType: z.enum(['bank', 'accounts_payable', 'accounts_receivable', 'other_current_asset', 'fixed_asset', 'other_asset', 'credit_card', 'other_current_liability', 'long_term_liability', 'equity', 'income', 'cost_of_goods_sold', 'expense', 'other_income', 'other_expense']).optional().describe('Filter by account type'),
    isActive: z.boolean().optional().describe('Filter by active status'),
    nameContains: z.string().optional().describe('Filter accounts where name contains this string'),
    includeInactive: z.boolean().default(false).describe('Include inactive accounts in results'),
}).merge(PaginationSchema);
export const GetAccountSchema = z.object({
    endUserId: EndUserIdSchema,
    accountId: z.string().describe('QuickBooks account ID'),
});
export const CreateAccountSchema = z.object({
    endUserId: EndUserIdSchema,
    name: z.string().min(1).describe('Account name'),
    accountType: z.enum(['bank', 'accounts_payable', 'accounts_receivable', 'other_current_asset', 'fixed_asset', 'other_asset', 'credit_card', 'other_current_liability', 'long_term_liability', 'equity', 'income', 'cost_of_goods_sold', 'expense', 'other_income', 'other_expense']).describe('Account type'),
    description: z.string().optional().describe('Account description'),
    accountNumber: z.string().optional().describe('Account number'),
    parentId: z.string().optional().describe('Parent account ID for sub-accounts'),
    isActive: z.boolean().default(true).describe('Whether the account is active'),
});
export const UpdateAccountSchema = z.object({
    endUserId: EndUserIdSchema,
    accountId: z.string().describe('QuickBooks account ID'),
    revisionNumber: z.string().describe('Current revision number of the account'),
    name: z.string().optional().describe('New account name'),
    description: z.string().optional().describe('New account description'),
    accountNumber: z.string().optional().describe('New account number'),
    isActive: z.boolean().optional().describe('New active status'),
});
export const ListBillsSchema = z.object({
    endUserId: EndUserIdSchema,
    vendorId: z.string().optional().describe('Filter by vendor ID'),
    vendorName: z.string().optional().describe('Filter by vendor name (partial match)'),
    isPaid: z.boolean().optional().describe('Filter by payment status'),
    refNumber: z.string().optional().describe('Filter by reference number'),
    memo: z.string().optional().describe('Filter by memo content'),
}).merge(DateRangeSchema).merge(PaginationSchema);
export const GetBillSchema = z.object({
    endUserId: EndUserIdSchema,
    billId: z.string().describe('QuickBooks bill ID'),
});
export const BillLineSchema = z.object({
    description: z.string().optional().describe('Line item description'),
    quantity: z.number().positive().optional().describe('Quantity'),
    rate: z.string().optional().describe('Rate per unit as decimal string'),
    amount: z.string().describe('Line total amount as decimal string'),
    accountId: z.string().optional().describe('Account ID for this line'),
    itemId: z.string().optional().describe('Item ID for this line'),
    classId: z.string().optional().describe('Class ID for this line'),
    customerId: z.string().optional().describe('Customer ID for billable expenses'),
});
export const CreateBillSchema = z.object({
    endUserId: EndUserIdSchema,
    vendorId: z.string().describe('Vendor ID'),
    transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Transaction date in YYYY-MM-DD format'),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('Due date in YYYY-MM-DD format'),
    refNumber: z.string().optional().describe('Reference number'),
    memo: z.string().optional().describe('Memo'),
    lines: z.array(BillLineSchema).min(1).describe('Bill line items'),
});
export const UpdateBillSchema = z.object({
    endUserId: EndUserIdSchema,
    billId: z.string().describe('QuickBooks bill ID'),
    revisionNumber: z.string().describe('Current revision number of the bill'),
    vendorId: z.string().optional().describe('New vendor ID'),
    transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('New transaction date in YYYY-MM-DD format'),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('New due date in YYYY-MM-DD format'),
    refNumber: z.string().optional().describe('New reference number'),
    memo: z.string().optional().describe('New memo'),
    lines: z.array(BillLineSchema.extend({
        id: z.string().optional().describe('Line ID for existing lines to update'),
    })).optional().describe('Updated bill line items'),
});
export const ListBillPaymentsSchema = z.object({
    endUserId: EndUserIdSchema,
    paymentType: z.enum(['check', 'credit_card']).optional().describe('Filter by payment type'),
    payeeId: z.string().optional().describe('Filter by payee (vendor) ID'),
    accountId: z.string().optional().describe('Filter by payment account ID'),
    refNumber: z.string().optional().describe('Filter by reference number'),
}).merge(DateRangeSchema).merge(PaginationSchema);
export const GetBillPaymentSchema = z.object({
    endUserId: EndUserIdSchema,
    paymentId: z.string().describe('QuickBooks bill payment ID'),
    paymentType: z.enum(['check', 'credit_card']).describe('Payment type'),
});
export const AppliedBillSchema = z.object({
    billId: z.string().describe('Bill ID to apply payment to'),
    appliedAmount: z.string().describe('Amount to apply as decimal string'),
});
export const CreateBillPaymentSchema = z.object({
    endUserId: EndUserIdSchema,
    paymentType: z.enum(['check', 'credit_card']).describe('Payment type'),
    payeeId: z.string().describe('Payee (vendor) ID'),
    accountId: z.string().describe('Payment account ID'),
    transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Payment date in YYYY-MM-DD format'),
    refNumber: z.string().optional().describe('Reference number'),
    memo: z.string().optional().describe('Payment memo'),
    appliedToBills: z.array(AppliedBillSchema).min(1).describe('Bills to apply this payment to'),
});
export const UpdateBillPaymentSchema = z.object({
    endUserId: EndUserIdSchema,
    paymentId: z.string().describe('QuickBooks bill payment ID'),
    paymentType: z.enum(['check', 'credit_card']).describe('Payment type'),
    revisionNumber: z.string().describe('Current revision number of the payment'),
    refNumber: z.string().optional().describe('New reference number'),
    memo: z.string().optional().describe('New memo'),
    appliedToBills: z.array(AppliedBillSchema).optional().describe('Updated bill applications'),
});
export const DeleteBillPaymentSchema = z.object({
    endUserId: EndUserIdSchema,
    paymentId: z.string().describe('QuickBooks bill payment ID'),
    paymentType: z.enum(['check', 'credit_card']).describe('Payment type'),
});
export const GetAccountTaxLinesSchema = z.object({
    endUserId: EndUserIdSchema,
    accountId: z.string().optional().describe('Filter by specific account ID'),
});
export const GenerateFinancialSummarySchema = z.object({
    endUserId: EndUserIdSchema,
    accountTypes: z.array(z.enum(['bank', 'accounts_payable', 'accounts_receivable', 'other_current_asset', 'fixed_asset', 'other_asset', 'credit_card', 'other_current_liability', 'long_term_liability', 'equity', 'income', 'cost_of_goods_sold', 'expense', 'other_income', 'other_expense'])).optional().describe('Account types to include in summary'),
    includeInactive: z.boolean().default(false).describe('Include inactive accounts'),
}).merge(DateRangeSchema);
export const GetVendorSpendingAnalysisSchema = z.object({
    endUserId: EndUserIdSchema,
    vendorId: z.string().optional().describe('Analyze specific vendor, or all vendors if not provided'),
    includePayments: z.boolean().default(true).describe('Include payment data in analysis'),
}).merge(DateRangeSchema);
export const PassthroughRequestSchema = z.object({
    endUserId: z.string().describe('End-user ID for the request'),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).describe('HTTP method'),
    endpoint: z.string().describe('API endpoint path (without base URL)'),
    data: z.record(z.any()).optional().describe('Request body data for POST/PUT requests'),
    params: z.record(z.string()).optional().describe('Query parameters'),
});
export const BulkOperationSchema = z.object({
    endUserId: EndUserIdSchema,
    operations: z.array(z.object({
        type: z.enum(['create_bill', 'update_bill', 'create_payment', 'update_payment']).describe('Operation type'),
        data: z.record(z.any()).describe('Operation-specific data'),
    })).min(1).max(10).describe('List of operations to perform (max 10)'),
    continueOnError: z.boolean().default(false).describe('Continue processing if one operation fails'),
});
//# sourceMappingURL=mcp-schemas.js.map