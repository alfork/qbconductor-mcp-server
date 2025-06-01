import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { ConductorClient } from '../services/conductor-client.js';
import { validateInput } from '../utils/validation.js';
import { formatSuccessResponse, formatPaginatedResponse, formatPaymentSummary, formatListResponse } from '../utils/formatting.js';
import { withErrorHandling } from '../utils/error-handling.js';
import { ListBillPaymentsSchema, GetBillPaymentSchema, CreateBillPaymentSchema, UpdateBillPaymentSchema, DeleteBillPaymentSchema } from '../schemas/mcp-schemas.js';

export const listBillCheckPaymentsTool: Tool = {
  name: 'list_bill_check_payments',
  description: 'Get check payments for bills from QuickBooks Desktop',
  inputSchema: {
    type: 'object',
    properties: {
      endUserId: {
        type: 'string',
        description: 'End-user ID to use for this operation (optional, uses default if not provided)'
      },
      payeeId: {
        type: 'string',
        description: 'Filter by payee (vendor) ID'
      },
      accountId: {
        type: 'string',
        description: 'Filter by payment account ID'
      },
      refNumber: {
        type: 'string',
        description: 'Filter by reference number'
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

export const listBillCreditCardPaymentsTool: Tool = {
  name: 'list_bill_credit_card_payments',
  description: 'Get credit card payments for bills from QuickBooks Desktop',
  inputSchema: {
    type: 'object',
    properties: {
      endUserId: {
        type: 'string',
        description: 'End-user ID to use for this operation (optional, uses default if not provided)'
      },
      payeeId: {
        type: 'string',
        description: 'Filter by payee (vendor) ID'
      },
      accountId: {
        type: 'string',
        description: 'Filter by payment account ID'
      },
      refNumber: {
        type: 'string',
        description: 'Filter by reference number'
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

export const createBillCheckPaymentTool: Tool = {
  name: 'create_bill_check_payment',
  description: 'Process bill payments via check in QuickBooks Desktop',
  inputSchema: {
    type: 'object',
    properties: {
      endUserId: {
        type: 'string',
        description: 'End-user ID to use for this operation (optional, uses default if not provided)'
      },
      payeeId: {
        type: 'string',
        description: 'Payee (vendor) ID'
      },
      accountId: {
        type: 'string',
        description: 'Payment account ID'
      },
      transactionDate: {
        type: 'string',
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        description: 'Payment date in YYYY-MM-DD format'
      },
      refNumber: {
        type: 'string',
        description: 'Reference number'
      },
      memo: {
        type: 'string',
        description: 'Payment memo'
      },
      appliedToBills: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            billId: {
              type: 'string',
              description: 'Bill ID to apply payment to'
            },
            appliedAmount: {
              type: 'string',
              description: 'Amount to apply as decimal string'
            }
          },
          required: ['billId', 'appliedAmount']
        },
        description: 'Bills to apply this payment to'
      }
    },
    required: ['payeeId', 'accountId', 'transactionDate', 'appliedToBills']
  }
};

export const createBillCreditCardPaymentTool: Tool = {
  name: 'create_bill_credit_card_payment',
  description: 'Process bill payments via credit card in QuickBooks Desktop',
  inputSchema: {
    type: 'object',
    properties: {
      endUserId: {
        type: 'string',
        description: 'End-user ID to use for this operation (optional, uses default if not provided)'
      },
      payeeId: {
        type: 'string',
        description: 'Payee (vendor) ID'
      },
      accountId: {
        type: 'string',
        description: 'Payment account ID'
      },
      transactionDate: {
        type: 'string',
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        description: 'Payment date in YYYY-MM-DD format'
      },
      refNumber: {
        type: 'string',
        description: 'Reference number'
      },
      memo: {
        type: 'string',
        description: 'Payment memo'
      },
      appliedToBills: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            billId: {
              type: 'string',
              description: 'Bill ID to apply payment to'
            },
            appliedAmount: {
              type: 'string',
              description: 'Amount to apply as decimal string'
            }
          },
          required: ['billId', 'appliedAmount']
        },
        description: 'Bills to apply this payment to'
      }
    },
    required: ['payeeId', 'accountId', 'transactionDate', 'appliedToBills']
  }
};

export const updatePaymentTool: Tool = {
  name: 'update_payment',
  description: 'Modify an existing bill payment (check or credit card)',
  inputSchema: {
    type: 'object',
    properties: {
      endUserId: {
        type: 'string',
        description: 'End-user ID to use for this operation (optional, uses default if not provided)'
      },
      paymentId: {
        type: 'string',
        description: 'QuickBooks bill payment ID'
      },
      paymentType: {
        type: 'string',
        enum: ['check', 'credit_card'],
        description: 'Payment type'
      },
      revisionNumber: {
        type: 'string',
        description: 'Current revision number of the payment'
      },
      refNumber: {
        type: 'string',
        description: 'New reference number'
      },
      memo: {
        type: 'string',
        description: 'New memo'
      },
      appliedToBills: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            billId: {
              type: 'string',
              description: 'Bill ID to apply payment to'
            },
            appliedAmount: {
              type: 'string',
              description: 'Amount to apply as decimal string'
            }
          },
          required: ['billId', 'appliedAmount']
        },
        description: 'Updated bill applications'
      }
    },
    required: ['paymentId', 'paymentType', 'revisionNumber']
  }
};

export const deletePaymentTool: Tool = {
  name: 'delete_payment',
  description: 'Remove a bill payment from QuickBooks Desktop',
  inputSchema: {
    type: 'object',
    properties: {
      endUserId: {
        type: 'string',
        description: 'End-user ID to use for this operation (optional, uses default if not provided)'
      },
      paymentId: {
        type: 'string',
        description: 'QuickBooks bill payment ID'
      },
      paymentType: {
        type: 'string',
        enum: ['check', 'credit_card'],
        description: 'Payment type'
      }
    },
    required: ['paymentId', 'paymentType']
  }
};

export const listBillCheckPaymentsHandler = withErrorHandling(async (input: unknown) => {
  const params = validateInput(ListBillPaymentsSchema.extend({
    paymentType: z.literal('check').optional(),
  }), input);
  
  const client = new ConductorClient(params.endUserId);
  
  const queryParams: Record<string, any> = {
    limit: params.limit,
    cursor: params.cursor,
  };
  
  if (params.payeeId) queryParams.payeeId = params.payeeId;
  if (params.accountId) queryParams.accountId = params.accountId;
  if (params.refNumber) queryParams.refNumber = params.refNumber;
  if (params.startDate) queryParams.transactionDateFrom = params.startDate;
  if (params.endDate) queryParams.transactionDateTo = params.endDate;

  const result = await client.get('/quickbooks-desktop/bill-check-payments', queryParams);

  return formatPaginatedResponse(
    result.data,
    result.hasMore,
    result.nextCursor,
    result.data.length,
    client.getEndUserId()
  );
});

export const listBillCreditCardPaymentsHandler = withErrorHandling(async (input: unknown) => {
  const params = validateInput(ListBillPaymentsSchema.extend({
    paymentType: z.literal('credit_card').optional(),
  }), input);
  
  const client = new ConductorClient(params.endUserId);
  
  const queryParams: Record<string, any> = {
    limit: params.limit,
    cursor: params.cursor,
  };
  
  if (params.payeeId) queryParams.payeeId = params.payeeId;
  if (params.accountId) queryParams.accountId = params.accountId;
  if (params.refNumber) queryParams.refNumber = params.refNumber;
  if (params.startDate) queryParams.transactionDateFrom = params.startDate;
  if (params.endDate) queryParams.transactionDateTo = params.endDate;

  const result = await client.get('/quickbooks-desktop/bill-credit-card-payments', queryParams);

  return formatPaginatedResponse(
    result.data,
    result.hasMore,
    result.nextCursor,
    result.data.length,
    client.getEndUserId()
  );
});

export const createBillCheckPaymentHandler = withErrorHandling(async (input: unknown) => {
  const params = validateInput(CreateBillPaymentSchema.extend({
    paymentType: z.literal('check'),
  }), input);
  
  const client = new ConductorClient(params.endUserId);
  const result = await client.post('/quickbooks-desktop/bill-check-payments', {
    payeeId: params.payeeId,
    accountId: params.accountId,
    transactionDate: params.transactionDate,
    refNumber: params.refNumber,
    memo: params.memo,
    appliedToBills: params.appliedToBills,
  });

  return formatSuccessResponse(result, {
    message: `Check payment created successfully for payee ${params.payeeId}`,
    endUserId: client.getEndUserId(),
  });
});

export const createBillCreditCardPaymentHandler = withErrorHandling(async (input: unknown) => {
  const params = validateInput(CreateBillPaymentSchema.extend({
    paymentType: z.literal('credit_card'),
  }), input);
  
  const client = new ConductorClient(params.endUserId);
  const result = await client.post('/quickbooks-desktop/bill-credit-card-payments', {
    payeeId: params.payeeId,
    accountId: params.accountId,
    transactionDate: params.transactionDate,
    refNumber: params.refNumber,
    memo: params.memo,
    appliedToBills: params.appliedToBills,
  });

  return formatSuccessResponse(result, {
    message: `Credit card payment created successfully for payee ${params.payeeId}`,
    endUserId: client.getEndUserId(),
  });
});

export const updatePaymentHandler = withErrorHandling(async (input: unknown) => {
  const params = validateInput(UpdateBillPaymentSchema, input);
  
  const client = new ConductorClient(params.endUserId);
  const endpoint = params.paymentType === 'check' 
    ? `/quickbooks-desktop/bill-check-payments/${params.paymentId}`
    : `/quickbooks-desktop/bill-credit-card-payments/${params.paymentId}`;
  
  const updateData: Record<string, any> = {
    revisionNumber: params.revisionNumber,
  };
  
  if (params.refNumber !== undefined) updateData.refNumber = params.refNumber;
  if (params.memo !== undefined) updateData.memo = params.memo;
  if (params.appliedToBills) updateData.appliedToBills = params.appliedToBills;

  const result = await client.post(endpoint, updateData);

  return formatSuccessResponse(result, {
    message: `${params.paymentType === 'check' ? 'Check' : 'Credit card'} payment ${params.paymentId} updated successfully`,
    endUserId: client.getEndUserId(),
  });
});

export const deletePaymentHandler = withErrorHandling(async (input: unknown) => {
  const params = validateInput(DeleteBillPaymentSchema, input);
  
  const client = new ConductorClient(params.endUserId);
  const endpoint = params.paymentType === 'check' 
    ? `/quickbooks-desktop/bill-check-payments/${params.paymentId}`
    : `/quickbooks-desktop/bill-credit-card-payments/${params.paymentId}`;

  await client.delete(endpoint);

  return formatSuccessResponse(null, {
    message: `${params.paymentType === 'check' ? 'Check' : 'Credit card'} payment ${params.paymentId} deleted successfully`,
    endUserId: client.getEndUserId(),
  });
});
