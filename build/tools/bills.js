import { ConductorClient } from '../services/conductor-client.js';
import { validateInput } from '../utils/validation.js';
import { formatSuccessResponse, formatPaginatedResponse, formatBillSummary, formatListResponse } from '../utils/formatting.js';
import { withErrorHandling } from '../utils/error-handling.js';
import { ListBillsSchema, GetBillSchema, CreateBillSchema, UpdateBillSchema } from '../schemas/mcp-schemas.js';
export const listBillsTool = {
    name: 'list_bills',
    description: 'Retrieve bills from QuickBooks Desktop with comprehensive filtering options',
    inputSchema: {
        type: 'object',
        properties: {
            endUserId: {
                type: 'string',
                description: 'End-user ID to use for this operation (optional, uses default if not provided)'
            },
            vendorId: {
                type: 'string',
                description: 'Filter by vendor ID'
            },
            vendorName: {
                type: 'string',
                description: 'Filter by vendor name (partial match)'
            },
            isPaid: {
                type: 'boolean',
                description: 'Filter by payment status'
            },
            refNumber: {
                type: 'string',
                description: 'Filter by reference number'
            },
            memo: {
                type: 'string',
                description: 'Filter by memo content'
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
export const getBillTool = {
    name: 'get_bill',
    description: 'Retrieve details for a specific QuickBooks bill',
    inputSchema: {
        type: 'object',
        properties: {
            endUserId: {
                type: 'string',
                description: 'End-user ID to use for this operation (optional, uses default if not provided)'
            },
            billId: {
                type: 'string',
                description: 'QuickBooks bill ID'
            }
        },
        required: ['billId']
    }
};
export const createBillTool = {
    name: 'create_bill',
    description: 'Create a new vendor bill in QuickBooks Desktop with line items',
    inputSchema: {
        type: 'object',
        properties: {
            endUserId: {
                type: 'string',
                description: 'End-user ID to use for this operation (optional, uses default if not provided)'
            },
            vendorId: {
                type: 'string',
                description: 'Vendor ID'
            },
            transactionDate: {
                type: 'string',
                pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                description: 'Transaction date in YYYY-MM-DD format'
            },
            dueDate: {
                type: 'string',
                pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                description: 'Due date in YYYY-MM-DD format'
            },
            refNumber: {
                type: 'string',
                description: 'Reference number'
            },
            memo: {
                type: 'string',
                description: 'Memo'
            },
            lines: {
                type: 'array',
                minItems: 1,
                items: {
                    type: 'object',
                    properties: {
                        description: {
                            type: 'string',
                            description: 'Line item description'
                        },
                        quantity: {
                            type: 'number',
                            minimum: 0,
                            description: 'Quantity'
                        },
                        rate: {
                            type: 'string',
                            description: 'Rate per unit as decimal string'
                        },
                        amount: {
                            type: 'string',
                            description: 'Line total amount as decimal string'
                        },
                        accountId: {
                            type: 'string',
                            description: 'Account ID for this line'
                        },
                        itemId: {
                            type: 'string',
                            description: 'Item ID for this line'
                        },
                        classId: {
                            type: 'string',
                            description: 'Class ID for this line'
                        },
                        customerId: {
                            type: 'string',
                            description: 'Customer ID for billable expenses'
                        }
                    },
                    required: ['amount']
                },
                description: 'Bill line items'
            }
        },
        required: ['vendorId', 'transactionDate', 'lines']
    }
};
export const updateBillTool = {
    name: 'update_bill',
    description: 'Modify an existing QuickBooks bill',
    inputSchema: {
        type: 'object',
        properties: {
            endUserId: {
                type: 'string',
                description: 'End-user ID to use for this operation (optional, uses default if not provided)'
            },
            billId: {
                type: 'string',
                description: 'QuickBooks bill ID'
            },
            revisionNumber: {
                type: 'string',
                description: 'Current revision number of the bill'
            },
            vendorId: {
                type: 'string',
                description: 'New vendor ID'
            },
            transactionDate: {
                type: 'string',
                pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                description: 'New transaction date in YYYY-MM-DD format'
            },
            dueDate: {
                type: 'string',
                pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                description: 'New due date in YYYY-MM-DD format'
            },
            refNumber: {
                type: 'string',
                description: 'New reference number'
            },
            memo: {
                type: 'string',
                description: 'New memo'
            },
            lines: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Line ID for existing lines to update'
                        },
                        description: {
                            type: 'string',
                            description: 'Line item description'
                        },
                        quantity: {
                            type: 'number',
                            minimum: 0,
                            description: 'Quantity'
                        },
                        rate: {
                            type: 'string',
                            description: 'Rate per unit as decimal string'
                        },
                        amount: {
                            type: 'string',
                            description: 'Line total amount as decimal string'
                        },
                        accountId: {
                            type: 'string',
                            description: 'Account ID for this line'
                        },
                        itemId: {
                            type: 'string',
                            description: 'Item ID for this line'
                        },
                        classId: {
                            type: 'string',
                            description: 'Class ID for this line'
                        },
                        customerId: {
                            type: 'string',
                            description: 'Customer ID for billable expenses'
                        }
                    }
                },
                description: 'Updated bill line items'
            }
        },
        required: ['billId', 'revisionNumber']
    }
};
export const listBillsHandler = withErrorHandling(async (input) => {
    const params = validateInput(ListBillsSchema, input);
    const client = new ConductorClient(params.endUserId);
    const queryParams = {
        limit: params.limit,
        cursor: params.cursor,
    };
    if (params.vendorId)
        queryParams.vendorId = params.vendorId;
    if (params.vendorName)
        queryParams.vendor = params.vendorName;
    if (params.isPaid !== undefined)
        queryParams.isPaid = params.isPaid;
    if (params.refNumber)
        queryParams.refNumber = params.refNumber;
    if (params.memo)
        queryParams.memo = params.memo;
    if (params.startDate)
        queryParams.transactionDateFrom = params.startDate;
    if (params.endDate)
        queryParams.transactionDateTo = params.endDate;
    const result = await client.get('/quickbooks-desktop/bills', queryParams);
    const summary = formatListResponse(result.data, formatBillSummary, 'QuickBooks Bills');
    return formatPaginatedResponse(result.data, result.hasMore, result.nextCursor, result.data.length, client.getEndUserId());
});
export const getBillHandler = withErrorHandling(async (input) => {
    const params = validateInput(GetBillSchema, input);
    const client = new ConductorClient(params.endUserId);
    const result = await client.get(`/quickbooks-desktop/bills/${params.billId}`);
    return formatSuccessResponse(result, {
        endUserId: client.getEndUserId(),
        summary: formatBillSummary(result),
    });
});
export const createBillHandler = withErrorHandling(async (input) => {
    const params = validateInput(CreateBillSchema, input);
    const client = new ConductorClient(params.endUserId);
    const result = await client.post('/quickbooks-desktop/bills', {
        vendorId: params.vendorId,
        transactionDate: params.transactionDate,
        dueDate: params.dueDate,
        refNumber: params.refNumber,
        memo: params.memo,
        lines: params.lines,
    });
    return formatSuccessResponse(result, {
        message: `Bill created successfully for vendor ${params.vendorId}`,
        endUserId: client.getEndUserId(),
    });
});
export const updateBillHandler = withErrorHandling(async (input) => {
    const params = validateInput(UpdateBillSchema, input);
    const client = new ConductorClient(params.endUserId);
    const updateData = {
        revisionNumber: params.revisionNumber,
    };
    if (params.vendorId)
        updateData.vendorId = params.vendorId;
    if (params.transactionDate)
        updateData.transactionDate = params.transactionDate;
    if (params.dueDate)
        updateData.dueDate = params.dueDate;
    if (params.refNumber !== undefined)
        updateData.refNumber = params.refNumber;
    if (params.memo !== undefined)
        updateData.memo = params.memo;
    if (params.lines)
        updateData.lines = params.lines;
    const result = await client.post(`/quickbooks-desktop/bills/${params.billId}`, updateData);
    return formatSuccessResponse(result, {
        message: `Bill ${params.billId} updated successfully`,
        endUserId: client.getEndUserId(),
    });
});
//# sourceMappingURL=bills.js.map