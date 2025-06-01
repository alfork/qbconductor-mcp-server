import { ConductorClient } from '../services/conductor-client.js';
import { validateInput } from '../utils/validation.js';
import { formatSuccessResponse } from '../utils/formatting.js';
import { withErrorHandling } from '../utils/error-handling.js';
import { CreateAuthSessionSchema } from '../schemas/mcp-schemas.js';
import { appConfig } from '../config.js';
import { z } from 'zod';
export const createAuthSessionTool = {
    name: 'create_auth_session',
    description: 'Generate a QuickBooks authentication URL for an end-user to connect their QuickBooks Desktop',
    inputSchema: {
        type: 'object',
        properties: {
            endUserId: {
                type: 'string',
                description: 'End-user ID to create auth session for'
            },
            redirectUrl: {
                type: 'string',
                description: 'URL to redirect to after authentication (optional)'
            }
        },
        required: ['endUserId']
    }
};
export const checkConnectionStatusTool = {
    name: 'check_connection_status',
    description: 'Check if an end-user has an active QuickBooks Desktop connection',
    inputSchema: {
        type: 'object',
        properties: {
            endUserId: {
                type: 'string',
                description: 'End-user ID to check connection status for (optional, uses default if not provided)'
            }
        }
    }
};
export const createAuthSessionHandler = withErrorHandling(async (input) => {
    const params = validateInput(CreateAuthSessionSchema, input);
    const client = new ConductorClient();
    const result = await client.post('/auth-sessions', {
        publishableKey: appConfig.conductor.publishableKey,
        endUserId: params.endUserId,
        redirectUrl: params.redirectUrl,
    });
    return formatSuccessResponse(result, {
        message: 'Authentication session created successfully. Direct the end-user to the provided URL to connect their QuickBooks Desktop.',
        instructions: 'The end-user should visit the authentication URL while QuickBooks Desktop is running with their company file open.',
    });
});
export const checkConnectionStatusHandler = withErrorHandling(async (input) => {
    const params = validateInput(z.object({
        endUserId: z.string().optional(),
    }), input);
    const client = new ConductorClient(params.endUserId);
    try {
        const result = await client.get('/quickbooks-desktop/utilities/health-check', {}, false);
        return formatSuccessResponse({
            connected: true,
            status: 'active',
            endUserId: client.getEndUserId(),
            lastChecked: new Date().toISOString(),
        }, {
            message: 'QuickBooks Desktop connection is active and healthy',
        });
    }
    catch (error) {
        if (error.message.includes('not connected') || error.message.includes('502')) {
            return formatSuccessResponse({
                connected: false,
                status: 'disconnected',
                endUserId: client.getEndUserId(),
                lastChecked: new Date().toISOString(),
                error: 'QuickBooks Desktop is not connected or not responding',
            }, {
                message: 'QuickBooks Desktop connection is not active',
                instructions: 'Ensure QuickBooks Desktop is running with a company file open, or create a new auth session if needed.',
            });
        }
        throw error;
    }
});
//# sourceMappingURL=auth.js.map