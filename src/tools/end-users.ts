import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ConductorClient } from '../services/conductor-client.js';
import { validateInput } from '../utils/validation.js';
import { formatSuccessResponse, formatErrorResponse } from '../utils/formatting.js';
import { withErrorHandling } from '../utils/error-handling.js';
import { CreateEndUserSchema, EndUserIdSchema } from '../schemas/mcp-schemas.js';
import { z } from 'zod';

export const createEndUserTool: Tool = {
  name: 'create_end_user',
  description: 'Create a new QuickBooks end-user for authentication and data access',
  inputSchema: {
    type: 'object',
    properties: {
      sourceId: {
        type: 'string',
        description: 'Your internal ID for this end-user'
      },
      email: {
        type: 'string',
        description: 'Email address of the end-user'
      },
      companyName: {
        type: 'string',
        description: 'Company name for the end-user'
      }
    }
  }
};

export const listEndUsersTool: Tool = {
  name: 'list_end_users',
  description: 'List all QuickBooks end-users',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'Number of records to return (1-100)',
        minimum: 1,
        maximum: 100,
        default: 50
      },
      cursor: {
        type: 'string',
        description: 'Cursor for pagination to get the next page of results'
      }
    }
  }
};

export const getEndUserTool: Tool = {
  name: 'get_end_user',
  description: 'Retrieve details for a specific QuickBooks end-user',
  inputSchema: {
    type: 'object',
    properties: {
      endUserId: {
        type: 'string',
        description: 'End-user ID to retrieve'
      }
    },
    required: ['endUserId']
  }
};

export const deleteEndUserTool: Tool = {
  name: 'delete_end_user',
  description: 'Delete a QuickBooks end-user',
  inputSchema: {
    type: 'object',
    properties: {
      endUserId: {
        type: 'string',
        description: 'End-user ID to delete'
      }
    },
    required: ['endUserId']
  }
};

export const createEndUserHandler = withErrorHandling(async (input: unknown) => {
  const params = validateInput(CreateEndUserSchema, input);
  
  const client = new ConductorClient();
  const result = await client.post('/end-users', {
    sourceId: params.sourceId,
    email: params.email,
    companyName: params.companyName,
  });

  return formatSuccessResponse(result, {
    message: 'End-user created successfully',
  });
});

export const listEndUsersHandler = withErrorHandling(async (input: unknown) => {
  const params = validateInput(z.object({
    limit: z.number().min(1).max(100).default(50),
    cursor: z.string().optional(),
  }), input);

  const client = new ConductorClient();
  const result = await client.get('/end-users', {
    limit: params.limit,
    cursor: params.cursor,
  });

  return formatSuccessResponse(result.data, {
    totalCount: result.data.length,
    hasMore: result.hasMore,
    nextCursor: result.nextCursor,
  });
});

export const getEndUserHandler = withErrorHandling(async (input: unknown) => {
  const params = validateInput(z.object({
    endUserId: z.string(),
  }), input);

  const client = new ConductorClient();
  const result = await client.get(`/end-users/${params.endUserId}`);

  return formatSuccessResponse(result);
});

export const deleteEndUserHandler = withErrorHandling(async (input: unknown) => {
  const params = validateInput(z.object({
    endUserId: z.string(),
  }), input);

  const client = new ConductorClient();
  await client.delete(`/end-users/${params.endUserId}`);

  return formatSuccessResponse(null, {
    message: `End-user ${params.endUserId} deleted successfully`,
  });
});
