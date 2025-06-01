import { ConductorClient } from '../services/conductor-client.js';
import { validateInput } from '../utils/validation.js';
import { formatSuccessResponse, formatPaginatedResponse, formatAccountSummary, formatListResponse } from '../utils/formatting.js';
import { withErrorHandling } from '../utils/error-handling.js';
import { ListAccountsSchema, GetAccountSchema, CreateAccountSchema, UpdateAccountSchema } from '../schemas/mcp-schemas.js';
export const listAccountsTool = {
    name: 'list_accounts',
    description: 'Get chart of accounts from QuickBooks Desktop with filtering options',
    inputSchema: {
        type: 'object',
        properties: {
            endUserId: {
                type: 'string',
                description: 'End-user ID to use for this operation (optional, uses default if not provided)'
            },
            accountType: {
                type: 'string',
                enum: ['bank', 'accounts_payable', 'accounts_receivable', 'other_current_asset', 'fixed_asset', 'other_asset', 'credit_card', 'other_current_liability', 'long_term_liability', 'equity', 'income', 'cost_of_goods_sold', 'expense', 'other_income', 'other_expense'],
                description: 'Filter by account type'
            },
            isActive: {
                type: 'boolean',
                description: 'Filter by active status'
            },
            nameContains: {
                type: 'string',
                description: 'Filter accounts where name contains this string'
            },
            includeInactive: {
                type: 'boolean',
                default: false,
                description: 'Include inactive accounts in results'
            },
            limit: {
                type: 'number',
                minimum: 1,
                maximum: 100,
                default: 50,
                description: 'Number of records to return (1-100)'
            },
            cursor: {
                type: 'string',
                description: 'Cursor for pagination to get the next page of results'
            }
        }
    }
};
export const getAccountTool = {
    name: 'get_account',
    description: 'Retrieve details for a specific QuickBooks account',
    inputSchema: {
        type: 'object',
        properties: {
            endUserId: {
                type: 'string',
                description: 'End-user ID to use for this operation (optional, uses default if not provided)'
            },
            accountId: {
                type: 'string',
                description: 'QuickBooks account ID'
            }
        },
        required: ['accountId']
    }
};
export const createAccountTool = {
    name: 'create_account',
    description: 'Create a new financial account in QuickBooks Desktop',
    inputSchema: {
        type: 'object',
        properties: {
            endUserId: {
                type: 'string',
                description: 'End-user ID to use for this operation (optional, uses default if not provided)'
            },
            name: {
                type: 'string',
                description: 'Account name'
            },
            accountType: {
                type: 'string',
                enum: ['bank', 'accounts_payable', 'accounts_receivable', 'other_current_asset', 'fixed_asset', 'other_asset', 'credit_card', 'other_current_liability', 'long_term_liability', 'equity', 'income', 'cost_of_goods_sold', 'expense', 'other_income', 'other_expense'],
                description: 'Account type'
            },
            description: {
                type: 'string',
                description: 'Account description'
            },
            accountNumber: {
                type: 'string',
                description: 'Account number'
            },
            parentId: {
                type: 'string',
                description: 'Parent account ID for sub-accounts'
            },
            isActive: {
                type: 'boolean',
                default: true,
                description: 'Whether the account is active'
            }
        },
        required: ['name', 'accountType']
    }
};
export const updateAccountTool = {
    name: 'update_account',
    description: 'Modify an existing QuickBooks account',
    inputSchema: {
        type: 'object',
        properties: {
            endUserId: {
                type: 'string',
                description: 'End-user ID to use for this operation (optional, uses default if not provided)'
            },
            accountId: {
                type: 'string',
                description: 'QuickBooks account ID'
            },
            revisionNumber: {
                type: 'string',
                description: 'Current revision number of the account'
            },
            name: {
                type: 'string',
                description: 'New account name'
            },
            description: {
                type: 'string',
                description: 'New account description'
            },
            accountNumber: {
                type: 'string',
                description: 'New account number'
            },
            isActive: {
                type: 'boolean',
                description: 'New active status'
            }
        },
        required: ['accountId', 'revisionNumber']
    }
};
export const listAccountsHandler = withErrorHandling(async (input) => {
    const params = validateInput(ListAccountsSchema, input);
    const client = new ConductorClient(params.endUserId);
    const queryParams = {
        limit: params.limit,
        cursor: params.cursor,
    };
    if (params.accountType)
        queryParams.accountType = params.accountType;
    if (params.isActive !== undefined)
        queryParams.isActive = params.isActive;
    if (params.nameContains)
        queryParams.name = params.nameContains;
    if (params.includeInactive)
        queryParams.includeInactive = params.includeInactive;
    const result = await client.get('/quickbooks-desktop/accounts', queryParams);
    const summary = formatListResponse(result.data, formatAccountSummary, 'QuickBooks Accounts');
    return formatPaginatedResponse(result.data, result.hasMore, result.nextCursor, result.data.length, client.getEndUserId());
});
export const getAccountHandler = withErrorHandling(async (input) => {
    const params = validateInput(GetAccountSchema, input);
    const client = new ConductorClient(params.endUserId);
    const result = await client.get(`/quickbooks-desktop/accounts/${params.accountId}`);
    return formatSuccessResponse(result, {
        endUserId: client.getEndUserId(),
        summary: formatAccountSummary(result),
    });
});
export const createAccountHandler = withErrorHandling(async (input) => {
    const params = validateInput(CreateAccountSchema, input);
    const client = new ConductorClient(params.endUserId);
    const result = await client.post('/quickbooks-desktop/accounts', {
        name: params.name,
        accountType: params.accountType,
        description: params.description,
        accountNumber: params.accountNumber,
        parentId: params.parentId,
        isActive: params.isActive,
    });
    return formatSuccessResponse(result, {
        message: `Account "${params.name}" created successfully`,
        endUserId: client.getEndUserId(),
    });
});
export const updateAccountHandler = withErrorHandling(async (input) => {
    const params = validateInput(UpdateAccountSchema, input);
    const client = new ConductorClient(params.endUserId);
    const updateData = {
        revisionNumber: params.revisionNumber,
    };
    if (params.name)
        updateData.name = params.name;
    if (params.description !== undefined)
        updateData.description = params.description;
    if (params.accountNumber !== undefined)
        updateData.accountNumber = params.accountNumber;
    if (params.isActive !== undefined)
        updateData.isActive = params.isActive;
    const result = await client.post(`/quickbooks-desktop/accounts/${params.accountId}`, updateData);
    return formatSuccessResponse(result, {
        message: `Account ${params.accountId} updated successfully`,
        endUserId: client.getEndUserId(),
    });
});
//# sourceMappingURL=accounts.js.map