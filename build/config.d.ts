/**
 * Configuration handling for QuickBooks Desktop MCP Server via Conductor API
 *
 * The required environment variables (CONDUCTOR_SECRET_KEY, CONDUCTOR_API_KEY, and CONDUCTOR_END_USER_ID)
 * are passed securely through Claude Desktop config JSON or environment variables. Optionally,
 * they can be parsed via command line arguments when running the server locally.
 *
 * Configuration can be passed via Claude Desktop config JSON (recommended):
 * {
 *   "mcpServers": {
 *     "QuickBooks": {
 *       "command": "npx",
 *       "args": ["-y", "@alfork/qbconductor-mcp-server@latest"],
 *       "env": {
 *         "CONDUCTOR_SECRET_KEY": "sk_prod_your_secret_key",
 *         "CONDUCTOR_API_KEY": "pk_prod_your_publishable_key",
 *         "CONDUCTOR_END_USER_ID": "end_usr_your_default_user"
 *       }
 *     }
 *   }
 * }
 */
export interface ConductorConfig {
    apiBaseUrl: string;
    secretKey: string;
    publishableKey: string;
    defaultEndUserId: string;
}
export interface CacheConfig {
    ttlMinutes: number;
    maxSize: number;
}
export interface LoggingConfig {
    level: string;
}
export interface AppConfig {
    conductor: ConductorConfig;
    cache: CacheConfig;
    logging: LoggingConfig;
    disabledTools: string[];
}
export declare const appConfig: AppConfig;
//# sourceMappingURL=config.d.ts.map