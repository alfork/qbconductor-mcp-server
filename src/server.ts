import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { tools, toolHandlers } from './tools/index.js';
import { logger } from './logger.js';
import { formatErrorResponse } from './utils/formatting.js';

export class QuickBooksDesktopMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'qbconductor-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logger.debug('Listing available tools', { toolCount: tools.length });
      return {
        tools,
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      logger.info('Tool call received', {
        toolName: name,
        hasArguments: !!args,
      });

      try {
        const handler = toolHandlers[name];
        if (!handler) {
          const error = `Unknown tool: ${name}`;
          logger.error(error, { availableTools: Object.keys(toolHandlers) });
          throw new Error(error);
        }

        const result = await handler(args || {});
        
        logger.info('Tool call completed successfully', {
          toolName: name,
          success: result.success,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: any) {
        logger.error('Tool call failed', {
          toolName: name,
          error: error.message,
          stack: error.stack,
        });

        const errorResponse = formatErrorResponse(error);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(errorResponse, null, 2),
            },
          ],
          isError: true,
        };
      }
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled promise rejection', {
        reason: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
        promise: promise.toString(),
      });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception', {
        error: error.message,
        stack: error.stack,
      });
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    
    logger.info('Starting QuickBooks Desktop MCP Server', {
      toolCount: tools.length,
      availableTools: tools.map(tool => tool.name),
    });

    await this.server.connect(transport);
    
    logger.info('QuickBooks Desktop MCP Server started successfully');
    logger.debug('MCP Server ready to handle protocol messages');
  }

  async stop(): Promise<void> {
    logger.info('Stopping QuickBooks Desktop MCP Server');
    await this.server.close();
  }
}
