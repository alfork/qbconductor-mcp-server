import { ConductorClient } from '../services/conductor-client.js';
import { validateInput } from '../utils/validation.js';
import { formatSuccessResponse, formatFinancialAmount, formatVendorSpending, formatListResponse } from '../utils/formatting.js';
import { withErrorHandling } from '../utils/error-handling.js';
import { GetAccountTaxLinesSchema, GenerateFinancialSummarySchema, GetVendorSpendingAnalysisSchema } from '../schemas/mcp-schemas.js';
export const getAccountTaxLinesTool = {
    name: 'get_account_tax_lines',
    description: 'Retrieve tax line information for QuickBooks accounts',
    inputSchema: {
        type: 'object',
        properties: {
            endUserId: {
                type: 'string',
                description: 'End-user ID to use for this operation (optional, uses default if not provided)'
            },
            accountId: {
                type: 'string',
                description: 'Filter by specific account ID'
            }
        }
    }
};
export const generateFinancialSummaryTool = {
    name: 'generate_financial_summary',
    description: 'Aggregate financial data across accounts for comprehensive reporting',
    inputSchema: {
        type: 'object',
        properties: {
            endUserId: {
                type: 'string',
                description: 'End-user ID to use for this operation (optional, uses default if not provided)'
            },
            accountTypes: {
                type: 'array',
                items: {
                    type: 'string',
                    enum: ['bank', 'accounts_payable', 'accounts_receivable', 'other_current_asset', 'fixed_asset', 'other_asset', 'credit_card', 'other_current_liability', 'long_term_liability', 'equity', 'income', 'cost_of_goods_sold', 'expense', 'other_income', 'other_expense']
                },
                description: 'Account types to include in summary'
            },
            includeInactive: {
                type: 'boolean',
                default: false,
                description: 'Include inactive accounts'
            },
            startDate: {
                type: 'string',
                pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                description: 'Start date in YYYY-MM-DD format'
            },
            endDate: {
                type: 'string',
                pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                description: 'End date in YYYY-MM-DD format'
            }
        }
    }
};
export const getVendorSpendingAnalysisTool = {
    name: 'get_vendor_spending_analysis',
    description: 'Analyze spending by vendor combining bills and payments data',
    inputSchema: {
        type: 'object',
        properties: {
            endUserId: {
                type: 'string',
                description: 'End-user ID to use for this operation (optional, uses default if not provided)'
            },
            vendorId: {
                type: 'string',
                description: 'Analyze specific vendor, or all vendors if not provided'
            },
            includePayments: {
                type: 'boolean',
                default: true,
                description: 'Include payment data in analysis'
            },
            startDate: {
                type: 'string',
                pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                description: 'Start date in YYYY-MM-DD format'
            },
            endDate: {
                type: 'string',
                pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                description: 'End date in YYYY-MM-DD format'
            }
        }
    }
};
export const getAccountTaxLinesHandler = withErrorHandling(async (input) => {
    const params = validateInput(GetAccountTaxLinesSchema, input);
    const client = new ConductorClient(params.endUserId);
    const queryParams = {};
    if (params.accountId)
        queryParams.accountId = params.accountId;
    const result = await client.get('/quickbooks-desktop/account-tax-lines', queryParams);
    return formatSuccessResponse(result.data, {
        totalCount: result.data.length,
        endUserId: client.getEndUserId(),
        message: `Retrieved ${result.data.length} tax line entries`,
    });
});
export const generateFinancialSummaryHandler = withErrorHandling(async (input) => {
    const params = validateInput(GenerateFinancialSummarySchema, input);
    const client = new ConductorClient(params.endUserId);
    const queryParams = {
        includeInactive: params.includeInactive,
    };
    if (params.accountTypes && params.accountTypes.length > 0) {
        queryParams.accountType = params.accountTypes;
    }
    const accounts = await client.getAllPages('/quickbooks-desktop/accounts', queryParams);
    const summary = {
        totalAccounts: accounts.length,
        accountsByType: {},
        balancesByType: {},
        totalBalance: 0,
        activeAccounts: 0,
        inactiveAccounts: 0,
        dateRange: {
            startDate: params.startDate,
            endDate: params.endDate,
        },
    };
    accounts.forEach((account) => {
        const accountType = account.accountType;
        const balance = parseFloat(account.balance || '0');
        summary.accountsByType[accountType] = (summary.accountsByType[accountType] || 0) + 1;
        summary.balancesByType[accountType] = (summary.balancesByType[accountType] || 0) + balance;
        summary.totalBalance += balance;
        if (account.isActive) {
            summary.activeAccounts++;
        }
        else {
            summary.inactiveAccounts++;
        }
    });
    const formattedSummary = {
        ...summary,
        totalBalanceFormatted: formatFinancialAmount(summary.totalBalance),
        balancesByTypeFormatted: Object.entries(summary.balancesByType).reduce((acc, [type, balance]) => {
            acc[type] = formatFinancialAmount(balance);
            return acc;
        }, {}),
    };
    return formatSuccessResponse(formattedSummary, {
        endUserId: client.getEndUserId(),
        message: `Financial summary generated for ${accounts.length} accounts`,
    });
});
export const getVendorSpendingAnalysisHandler = withErrorHandling(async (input) => {
    const params = validateInput(GetVendorSpendingAnalysisSchema, input);
    const client = new ConductorClient(params.endUserId);
    const billQueryParams = {};
    const paymentQueryParams = {};
    if (params.vendorId) {
        billQueryParams.vendorId = params.vendorId;
        paymentQueryParams.payeeId = params.vendorId;
    }
    if (params.startDate) {
        billQueryParams.transactionDateFrom = params.startDate;
        paymentQueryParams.transactionDateFrom = params.startDate;
    }
    if (params.endDate) {
        billQueryParams.transactionDateTo = params.endDate;
        paymentQueryParams.transactionDateTo = params.endDate;
    }
    const [bills, checkPayments, creditCardPayments] = await Promise.all([
        client.getAllPages('/quickbooks-desktop/bills', billQueryParams),
        params.includePayments ? client.getAllPages('/quickbooks-desktop/bill-check-payments', paymentQueryParams) : [],
        params.includePayments ? client.getAllPages('/quickbooks-desktop/bill-credit-card-payments', paymentQueryParams) : [],
    ]);
    const vendorAnalysis = {};
    bills.forEach((bill) => {
        const vendorId = bill.vendor?.id;
        const vendorName = bill.vendor?.fullName || 'Unknown Vendor';
        const amount = parseFloat(bill.totalAmount || '0');
        if (!vendorAnalysis[vendorId]) {
            vendorAnalysis[vendorId] = {
                vendorName,
                totalBilled: 0,
                totalPaid: 0,
                billCount: 0,
                paymentCount: 0,
                outstandingBalance: 0,
            };
        }
        vendorAnalysis[vendorId].totalBilled += amount;
        vendorAnalysis[vendorId].billCount++;
        if (!bill.isPaid) {
            vendorAnalysis[vendorId].outstandingBalance += parseFloat(bill.openBalance || '0');
        }
    });
    [...checkPayments, ...creditCardPayments].forEach((payment) => {
        const payeeId = payment.payee?.id;
        const amount = parseFloat(payment.totalAmount || '0');
        if (vendorAnalysis[payeeId]) {
            vendorAnalysis[payeeId].totalPaid += amount;
            vendorAnalysis[payeeId].paymentCount++;
        }
    });
    const analysisResults = Object.values(vendorAnalysis).map(vendor => ({
        ...vendor,
        totalBilledFormatted: formatFinancialAmount(vendor.totalBilled),
        totalPaidFormatted: formatFinancialAmount(vendor.totalPaid),
        outstandingBalanceFormatted: formatFinancialAmount(vendor.outstandingBalance),
    }));
    analysisResults.sort((a, b) => b.totalBilled - a.totalBilled);
    const summary = formatListResponse(analysisResults, (vendor) => formatVendorSpending(vendor.vendorName, vendor.totalBilled, vendor.billCount, vendor.paymentCount), 'Vendor Spending Analysis');
    return formatSuccessResponse(analysisResults, {
        endUserId: client.getEndUserId(),
        totalVendors: analysisResults.length,
        totalBills: bills.length,
        totalPayments: checkPayments.length + creditCardPayments.length,
        dateRange: {
            startDate: params.startDate,
            endDate: params.endDate,
        },
        summary,
    });
});
//# sourceMappingURL=reporting.js.map