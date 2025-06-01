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

import { config } from 'dotenv';

config();

const args = process.argv.slice(2);
const envArgs: { [key: string]: string } = {};
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--env' && i + 1 < args.length) {
    const [key, value] = args[i + 1].split('=');
    if (key === 'CONDUCTOR_SECRET_KEY') envArgs.conductorSecretKey = value;
    if (key === 'CONDUCTOR_API_KEY') envArgs.conductorApiKey = value;
    if (key === 'CONDUCTOR_END_USER_ID') envArgs.conductorEndUserId = value;
    if (key === 'CONDUCTOR_API_BASE_URL') envArgs.conductorApiBaseUrl = value;
    if (key === 'LOG_LEVEL') envArgs.logLevel = value;
    if (key === 'CACHE_TTL_MINUTES') envArgs.cacheTtlMinutes = value;
    if (key === 'CACHE_MAX_SIZE') envArgs.cacheMaxSize = value;
    if (key === 'DISABLED_TOOLS') envArgs.disabledTools = value;
    i++;
  }
}

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

const configuration = {
  conductorSecretKey: envArgs.conductorSecretKey || process.env.CONDUCTOR_SECRET_KEY || '',
  conductorApiKey: envArgs.conductorApiKey || process.env.CONDUCTOR_API_KEY || '',
  conductorEndUserId: envArgs.conductorEndUserId || process.env.CONDUCTOR_END_USER_ID || '',
  conductorApiBaseUrl: envArgs.conductorApiBaseUrl || process.env.CONDUCTOR_API_BASE_URL || 'https://api.conductor.is/v1',
  logLevel: envArgs.logLevel || process.env.LOG_LEVEL || 'info',
  cacheTtlMinutes: envArgs.cacheTtlMinutes || process.env.CACHE_TTL_MINUTES || '1440',
  cacheMaxSize: envArgs.cacheMaxSize || process.env.CACHE_MAX_SIZE || '1000',
  disabledTools: (envArgs.disabledTools || process.env.DISABLED_TOOLS || '')
    ?.split(',')
    .map(tool => tool.trim())
    .filter(tool => tool !== '') || [],
};

const requiredVars = ['conductorSecretKey', 'conductorApiKey', 'conductorEndUserId'];
const missingEnvVars = requiredVars
  .filter(key => !configuration[key as keyof typeof configuration])
  .map(key => key);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export const appConfig: AppConfig = {
  conductor: {
    apiBaseUrl: configuration.conductorApiBaseUrl,
    secretKey: configuration.conductorSecretKey,
    publishableKey: configuration.conductorApiKey,
    defaultEndUserId: configuration.conductorEndUserId,
  },
  cache: {
    ttlMinutes: parseInt(configuration.cacheTtlMinutes),
    maxSize: parseInt(configuration.cacheMaxSize),
  },
  logging: {
    level: configuration.logLevel,
  },
  disabledTools: configuration.disabledTools,
};
