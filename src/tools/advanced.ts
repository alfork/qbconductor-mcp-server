import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { ConductorClient } from '../services/conductor-client.js';
import { validateInput } from '../utils/validation.js';
import { formatSuccessResponse, formatErrorResponse } from '../utils/formatting.js';
import { withErrorHandling } from '../utils/error-handling.js';
import { PassthroughRequestSchema, BulkOperationSchema } from '../schemas/mcp-schemas.js';
import { logger } from '../logger.js';

export const passthroughRequestTool: Tool = {
  name: 'passthrough_request',
  description: 'Make direct API calls to the Conductor API for custom operations not covered by other tools',
  inputSchema: {
    type: 'object',
    properties: {
      endUserId: {
        type: 'string',
        description: 'End-user ID for the request'
      },
      method: {
        type: 'string',
        enum: ['GET', 'POST', 'PUT', 'DELETE'],
        description: 'HTTP method'
      },
      endpoint: {
        type: 'string',
        description: 'API endpoint path (without base URL)'
      },
      data: {
        type: 'object',
        description: 'Request body data for POST/PUT requests'
      },
      params: {
        type: 'object',
        description: 'Query parameters'
      }
    },
    required: ['endUserId', 'method', 'endpoint']
  }
};

export const bulkOperationsTool: Tool = {
  name: 'bulk_operations',
  description: 'Perform multiple QuickBooks operations in batch with proper error handling',
  inputSchema: {
    type: 'object',
    properties: {
      endUserId: {
        type: 'string',
        description: 'End-user ID to use for this operation (optional, uses default if not provided)'
      },
      operations: {
        type: 'array',
        minItems: 1,
        maxItems: 10,
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['create_bill', 'update_bill', 'create_payment', 'update_payment'],
              description: 'Operation type'
            },
            data: {
              type: 'object',
              description: 'Operation-specific data'
            }
          },
          required: ['type', 'data']
        },
        description: 'List of operations to perform (max 10)'
      },
      continueOnError: {
        type: 'boolean',
        default: false,
        description: 'Continue processing if one operation fails'
      }
    },
    required: ['operations']
  }
};

export const passthroughRequestHandler = withErrorHandling(async (input: unknown) => {
  const params = validateInput(PassthroughRequestSchema, input);
  
  const client = new ConductorClient(params.endUserId);
  
  logger.info('Executing passthrough request', {
    method: params.method,
    endpoint: params.endpoint,
    endUserId: params.endUserId,
  });

  let result: any;
  
  try {
    switch (params.method) {
      case 'GET':
        result = await client.get(params.endpoint, params.params || {}, false);
        break;
      case 'POST':
        result = await client.post(params.endpoint, params.data || {});
        break;
      case 'PUT':
        result = await client.post(params.endpoint, params.data || {});
        break;
      case 'DELETE':
        await client.delete(params.endpoint);
        result = { success: true, message: 'Resource deleted successfully' };
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${params.method}`);
    }
  } catch (error: any) {
    logger.error('Passthrough request failed', {
      method: params.method,
      endpoint: params.endpoint,
      error: error.message,
      endUserId: params.endUserId,
    });
    throw error;
  }

  return formatSuccessResponse(result, {
    method: params.method,
    endpoint: params.endpoint,
    endUserId: params.endUserId,
    message: 'Passthrough request completed successfully',
  });
});

export const bulkOperationsHandler = withErrorHandling(async (input: unknown) => {
  const params = validateInput(BulkOperationSchema, input);
  
  const client = new ConductorClient(params.endUserId);
  
  logger.info('Starting bulk operations', {
    operationCount: params.operations.length,
    continueOnError: params.continueOnError,
    endUserId: client.getEndUserId(),
  });

  const results: Array<{
    operation: any;
    success: boolean;
    result?: any;
    error?: string;
  }> = [];

  for (let i = 0; i < params.operations.length; i++) {
    const operation = params.operations[i];
    
    try {
      logger.debug(`Executing bulk operation ${i + 1}/${params.operations.length}`, {
        type: operation.type,
        endUserId: client.getEndUserId(),
      });

      let result: any;
      
      switch (operation.type) {
        case 'create_bill':
          result = await client.post('/quickbooks-desktop/bills', operation.data);
          break;
        case 'update_bill':
          const billId = operation.data.billId;
          delete operation.data.billId;
          result = await client.post(`/quickbooks-desktop/bills/${billId}`, operation.data);
          break;
        case 'create_payment':
          const paymentType = operation.data.paymentType || 'check';
          const endpoint = paymentType === 'check' 
            ? '/quickbooks-desktop/bill-check-payments'
            : '/quickbooks-desktop/bill-credit-card-payments';
          result = await client.post(endpoint, operation.data);
          break;
        case 'update_payment':
          const updatePaymentType = operation.data.paymentType || 'check';
          const paymentId = operation.data.paymentId;
          delete operation.data.paymentId;
          delete operation.data.paymentType;
          const updateEndpoint = updatePaymentType === 'check'
            ? `/quickbooks-desktop/bill-check-payments/${paymentId}`
            : `/quickbooks-desktop/bill-credit-card-payments/${paymentId}`;
          result = await client.post(updateEndpoint, operation.data);
          break;
        default:
          throw new Error(`Unsupported operation type: ${operation.type}`);
      }

      results.push({
        operation,
        success: true,
        result,
      });

      logger.debug(`Bulk operation ${i + 1} completed successfully`);

    } catch (error: any) {
      logger.error(`Bulk operation ${i + 1} failed`, {
        type: operation.type,
        error: error.message,
        endUserId: client.getEndUserId(),
      });

      results.push({
        operation,
        success: false,
        error: error.message,
      });

      if (!params.continueOnError) {
        logger.warn('Stopping bulk operations due to error and continueOnError=false');
        break;
      }
    }
  }

  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => !r.success).length;

  logger.info('Bulk operations completed', {
    total: results.length,
    successful: successCount,
    failed: errorCount,
    endUserId: client.getEndUserId(),
  });

  return formatSuccessResponse(results, {
    summary: {
      total: results.length,
      successful: successCount,
      failed: errorCount,
    },
    endUserId: client.getEndUserId(),
    message: `Bulk operations completed: ${successCount} successful, ${errorCount} failed`,
  });
});
