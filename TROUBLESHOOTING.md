# QuickBooks Desktop MCP Server Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the QuickBooks Desktop MCP Server.

## Table of Contents

- [Quick Diagnostics](#quick-diagnostics)
- [Installation Issues](#installation-issues)
- [Configuration Problems](#configuration-problems)
- [Authentication Errors](#authentication-errors)
- [Connection Issues](#connection-issues)
- [Performance Problems](#performance-problems)
- [Data Synchronization Issues](#data-synchronization-issues)
- [MCP Client Integration Issues](#mcp-client-integration-issues)
- [Error Code Reference](#error-code-reference)
- [Advanced Debugging](#advanced-debugging)
- [Getting Help](#getting-help)

## Quick Diagnostics

### Health Check Commands

Run these commands to quickly identify common issues:

```bash
# 1. Verify Node.js version
node --version  # Should be 18.0 or higher

# 2. Check installation
npm list --depth=0

# 3. Test configuration
npm run test:config

# 4. Test build
npm run build

# 5. Test basic connectivity
npm run test:connection
```

### Configuration Verification

#### Claude Desktop Configuration (Recommended)

For Claude Desktop integration, verify your configuration file:

```bash
# Check Claude Desktop config file location
# macOS:
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | jq .mcpServers.QuickBooks

# Windows:
type %APPDATA%\Claude\claude_desktop_config.json | jq .mcpServers.QuickBooks

# Linux:
cat ~/.config/Claude/claude_desktop_config.json | jq .mcpServers.QuickBooks
```

Expected configuration format:
```json
{
  "mcpServers": {
    "QuickBooks": {
      "command": "npx",
      "args": ["-y", "@alfork/qbconductor-mcp-server@latest"],
      "env": {
        "CONDUCTOR_SECRET_KEY": "sk_prod_your_secret_key",
        "CONDUCTOR_API_KEY": "pk_prod_your_publishable_key",
        "CONDUCTOR_END_USER_ID": "end_usr_your_default_user"
      }
    }
  }
}
```

#### Alternative: Environment Variables

For local development, verify environment variables:

```bash
# Check required environment variables
echo "Secret Key: ${CONDUCTOR_SECRET_KEY:0:10}..."
echo "API Key: ${CONDUCTOR_API_KEY:0:10}..."
echo "End User ID: ${CONDUCTOR_END_USER_ID}"
echo "Base URL: ${CONDUCTOR_API_BASE_URL}"
```

### Log Analysis

```bash
# View recent logs
tail -f logs/qbconductor-mcp.log

# Search for errors
grep "ERROR" logs/qbconductor-mcp.log | tail -10

# Check for authentication issues
grep "AUTH" logs/qbconductor-mcp.log | tail -5
```

## Installation Issues

### Issue: Node.js Version Incompatibility

**Symptoms:**
- Build failures with syntax errors
- Runtime errors about unsupported features
- Package installation failures

**Error Messages:**
```
Error: Unsupported Node.js version
SyntaxError: Unexpected token '?'
```

**Solutions:**
```bash
# Check current version
node --version

# Install Node.js 18+ using nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Or update using package manager
# Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS with Homebrew:
brew install node@18
```

### Issue: Package Installation Failures

**Symptoms:**
- `npm install` fails with permission errors
- Missing dependencies
- Version conflicts

**Error Messages:**
```
EACCES: permission denied
peer dep missing
ERESOLVE unable to resolve dependency tree
```

**Solutions:**
```bash
# Fix permission issues
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use specific npm version
npm install -g npm@latest
```

### Issue: TypeScript Compilation Errors

**Symptoms:**
- Build fails with type errors
- Missing type definitions
- Configuration errors

**Error Messages:**
```
TS2307: Cannot find module
TS2304: Cannot find name
TS6053: File not found
```

**Solutions:**
```bash
# Install missing type definitions
npm install --save-dev @types/node

# Check TypeScript configuration
npx tsc --showConfig

# Clean build and rebuild
npm run clean
npm run build

# Update TypeScript
npm install --save-dev typescript@latest
```

## Configuration Problems

### Issue: Claude Desktop Configuration Problems

**Symptoms:**
- Tools not appearing in Claude Desktop
- Authentication failures in Claude
- "Configuration not found" errors
- Server startup failures

**Common Configuration Issues:**

1. **Missing Environment Variables in Claude Config:**
```json
// ❌ Incorrect - missing required env variables
{
  "mcpServers": {
    "QuickBooks": {
      "command": "npx",
      "args": ["-y", "@alfork/qbconductor-mcp-server@latest"]
    }
  }
}

// ✅ Correct - with required env variables
{
  "mcpServers": {
    "QuickBooks": {
      "command": "npx",
      "args": ["-y", "@alfork/qbconductor-mcp-server@latest"],
      "env": {
        "CONDUCTOR_SECRET_KEY": "sk_prod_your_secret_key",
        "CONDUCTOR_API_KEY": "pk_prod_your_publishable_key",
        "CONDUCTOR_END_USER_ID": "end_usr_your_default_user"
      }
    }
  }
}
```

2. **Invalid JSON Syntax:**
```bash
# Validate Claude config JSON syntax
cat ~/.config/Claude/claude_desktop_config.json | jq .
```

3. **Wrong File Location:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

**Solutions:**

1. **Fix Claude Desktop Configuration:**
```bash
# 1. Locate Claude config file
# macOS:
open ~/Library/Application\ Support/Claude/

# Windows:
explorer %APPDATA%\Claude\

# Linux:
xdg-open ~/.config/Claude/

# 2. Edit claude_desktop_config.json with proper format
# 3. Restart Claude Desktop
```

2. **Verify Configuration:**
```bash
# Test JSON syntax
jq . ~/.config/Claude/claude_desktop_config.json

# Check for required fields
jq '.mcpServers.QuickBooks.env | keys' ~/.config/Claude/claude_desktop_config.json
```

### Issue: Missing Environment Variables (Local Development)

**Symptoms:**
- Authentication failures in local development
- "Configuration not found" errors
- Server startup failures

**Error Messages:**
```
Error: CONDUCTOR_SECRET_KEY is required
Error: Invalid configuration
Configuration validation failed
```

**Solutions:**
```bash
# 1. Create .env file from template
cp .env.example .env

# 2. Edit with your credentials
nano .env

# 3. Verify environment loading
node -e "require('dotenv').config(); console.log(process.env.CONDUCTOR_SECRET_KEY ? 'OK' : 'MISSING')"

# 4. Check file permissions
ls -la .env
chmod 600 .env
```

### Issue: Invalid API Credentials

**Symptoms:**
- 401 Unauthorized errors
- Authentication failed messages
- API key validation errors

**Error Messages:**
```
Error: Invalid API key
Authentication failed: 401 Unauthorized
API key does not have required permissions
```

**Solutions:**
1. **Verify API Keys in Conductor Dashboard:**
   - Log into [Conductor Dashboard](https://conductor.is)
   - Navigate to Settings → API Keys
   - Verify keys are active and not expired
   - Check key permissions

2. **Test API Keys:**
```bash
# Test secret key format
echo $CONDUCTOR_SECRET_KEY | grep -E "^sk_"

# Test publishable key format
echo $CONDUCTOR_PUBLISHABLE_KEY | grep -E "^pk_"

# Test API connectivity
curl -H "Authorization: Bearer $CONDUCTOR_SECRET_KEY" \
     https://api.conductor.is/v1/end-users
```

3. **Regenerate Keys if Necessary:**
   - Create new API keys in Conductor dashboard
   - Update environment variables
   - Restart the server

### Issue: API Key Configuration Problems

**Symptoms:**
- Authentication failures
- "Invalid API key" errors
- 401 Unauthorized responses

**Common Issues:**

1. **Wrong API Key Format:**
```json
// ❌ Incorrect - wrong key format
{
  "env": {
    "CONDUCTOR_SECRET_KEY": "your_secret_key",
    "CONDUCTOR_API_KEY": "your_api_key"
  }
}

// ✅ Correct - proper key format
{
  "env": {
    "CONDUCTOR_SECRET_KEY": "sk_prod_abc123...",
    "CONDUCTOR_API_KEY": "pk_prod_xyz789..."
  }
}
```

2. **Mixed Test/Production Keys:**
- Ensure both keys are from the same environment (test or production)
- `sk_test_...` should be paired with `pk_test_...`
- `sk_prod_...` should be paired with `pk_prod_...`

**Solutions:**

1. **Verify Key Format:**
```bash
# Check key prefixes in Claude config
jq '.mcpServers.QuickBooks.env | to_entries[] | select(.key | contains("KEY")) | .value[0:10]' ~/.config/Claude/claude_desktop_config.json
```

2. **Regenerate Keys:**
- Log into Conductor dashboard
- Generate new API key pair
- Update Claude Desktop configuration
- Restart Claude Desktop

### Issue: End-User Configuration Problems

**Symptoms:**
- "End-user not found" errors
- QuickBooks connection failures
- Multi-tenant issues

**Error Messages:**
```
Error: End-user not found: user_123
End-user does not have QuickBooks connection
Invalid end-user context
```

**Solutions:**
```bash
# 1. List available end-users
curl -H "Authorization: Bearer $CONDUCTOR_SECRET_KEY" \
     https://api.conductor.is/v1/end-users

# 2. Verify end-user ID format
echo $CONDUCTOR_END_USER_ID | grep -E "^user_"

# 3. Check end-user status
curl -H "Authorization: Bearer $CONDUCTOR_SECRET_KEY" \
     https://api.conductor.is/v1/end-users/$CONDUCTOR_END_USER_ID
```

## Authentication Errors

### Issue: Bearer Token Authentication Failures

**Symptoms:**
- All API calls return 401
- "Invalid token" errors
- Authentication header issues

**Debugging Steps:**
```bash
# 1. Check token format
echo "Token length: ${#CONDUCTOR_SECRET_KEY}"
echo "Token prefix: ${CONDUCTOR_SECRET_KEY:0:3}"

# 2. Test token directly
curl -v -H "Authorization: Bearer $CONDUCTOR_SECRET_KEY" \
     https://api.conductor.is/v1/end-users

# 3. Check for token corruption
echo $CONDUCTOR_SECRET_KEY | xxd | head -5
```

**Solutions:**
- Ensure no extra whitespace in environment variables
- Verify token is not truncated or corrupted
- Check for special characters in .env file
- Regenerate API keys if corrupted

### Issue: End-User Authentication Session Expired

**Symptoms:**
- QuickBooks operations fail
- "Session expired" errors
- Connection status shows disconnected

**Error Messages:**
```
Error: QuickBooks session expired
End-user authentication required
Connection status: disconnected
```

**Solutions:**
1. **Create New Authentication Session:**
```javascript
// Use create_auth_session tool
{
  "redirectUri": "https://your-app.com/callback",
  "state": "optional-state-parameter"
}
```

2. **Guide User Through Re-authentication:**
   - Generate new auth URL
   - Have user complete QuickBooks authentication
   - Verify connection status

3. **Implement Session Monitoring:**
```javascript
// Regular connection checks
setInterval(async () => {
  const status = await checkConnectionStatus();
  if (status.status !== 'connected') {
    // Trigger re-authentication
  }
}, 300000); // Check every 5 minutes
```

## Connection Issues

### Issue: Network Connectivity Problems

**Symptoms:**
- Timeout errors
- Connection refused
- DNS resolution failures

**Error Messages:**
```
Error: ECONNREFUSED
Error: ETIMEDOUT
Error: getaddrinfo ENOTFOUND
```

**Debugging Steps:**
```bash
# 1. Test basic connectivity
ping api.conductor.is

# 2. Test HTTPS connectivity
curl -I https://api.conductor.is/v1/health

# 3. Check DNS resolution
nslookup api.conductor.is

# 4. Test from different network
curl --interface eth1 https://api.conductor.is/v1/health
```

**Solutions:**
- Check firewall settings
- Verify proxy configuration
- Test from different network
- Contact network administrator

### Issue: SSL/TLS Certificate Problems

**Symptoms:**
- Certificate verification failures
- SSL handshake errors
- HTTPS connection issues

**Error Messages:**
```
Error: certificate verify failed
Error: SSL routines:ssl3_get_server_certificate
CERT_UNTRUSTED
```

**Solutions:**
```bash
# 1. Update certificates
sudo apt-get update && sudo apt-get install ca-certificates

# 2. Test SSL connection
openssl s_client -connect api.conductor.is:443

# 3. Check Node.js SSL configuration
node -e "console.log(process.versions.openssl)"

# 4. Bypass SSL verification (temporary)
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

### Issue: QuickBooks Desktop Connection Problems

**Symptoms:**
- QuickBooks not responding
- Company file access issues
- Desktop application errors

**Error Messages:**
```
Error: QuickBooks Desktop not running
Error: Company file not accessible
Error: QuickBooks permission denied
```

**Solutions:**
1. **Verify QuickBooks Desktop Status:**
   - Ensure QuickBooks Desktop is running
   - Open the correct company file
   - Check user permissions

2. **Check Conductor Integration:**
   - Verify Conductor connector is installed
   - Check connector status in QuickBooks
   - Restart QuickBooks if necessary

3. **Test Connection:**
```bash
# Use check_connection_status tool
{
  "detailed": true
}
```

## Performance Problems

### Issue: Slow API Response Times

**Symptoms:**
- Operations take longer than 10 seconds
- Timeout errors
- Poor user experience

**Debugging Steps:**
```bash
# 1. Check cache status
grep "CACHE" logs/qbconductor-mcp.log | tail -10

# 2. Monitor API response times
grep "RESPONSE_TIME" logs/qbconductor-mcp.log | tail -10

# 3. Check system resources
top -p $(pgrep node)
```

**Solutions:**
1. **Optimize Cache Configuration:**
```env
# Increase cache size and TTL
CACHE_TTL_MINUTES=60
CACHE_MAX_SIZE=2000
```

2. **Use Pagination:**
```javascript
// Instead of fetching all records
{
  "limit": 50,
  "cursor": "next_page_token"
}
```

3. **Implement Request Batching:**
```javascript
// Use bulk_operations for multiple requests
{
  "operations": [
    {"operation": "get_account", "parameters": {"accountId": "1"}},
    {"operation": "get_account", "parameters": {"accountId": "2"}}
  ]
}
```

### Issue: Memory Usage Problems

**Symptoms:**
- High memory consumption
- Out of memory errors
- Server crashes

**Error Messages:**
```
Error: JavaScript heap out of memory
Error: Cannot allocate memory
Process killed (OOM)
```

**Solutions:**
```bash
# 1. Increase Node.js memory limit
node --max-old-space-size=4096 dist/index.js

# 2. Monitor memory usage
node --inspect dist/index.js

# 3. Optimize cache size
export CACHE_MAX_SIZE=500

# 4. Use process manager with restart
pm2 start dist/index.js --max-memory-restart 1G
```

### Issue: Rate Limiting Problems

**Symptoms:**
- 429 Too Many Requests errors
- API calls being throttled
- Degraded performance

**Error Messages:**
```
Error: Rate limit exceeded (100 requests per minute)
Error: Too many requests, retry after 60 seconds
API quota exceeded
```

**Solutions:**
1. **Implement Exponential Backoff:**
```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.code === 'RATE_LIMIT_EXCEEDED' && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      throw error;
    }
  }
}
```

2. **Optimize Request Patterns:**
- Use bulk operations
- Implement request queuing
- Cache frequently accessed data
- Reduce unnecessary API calls

## Data Synchronization Issues

### Issue: Stale Cache Data

**Symptoms:**
- Outdated information returned
- Changes not reflected immediately
- Data inconsistencies

**Error Messages:**
```
Warning: Cache data may be stale
Data modified externally
Cache invalidation failed
```

**Solutions:**
```bash
# 1. Clear cache manually
rm -rf cache/*

# 2. Restart server to clear memory cache
pm2 restart qbconductor-mcp

# 3. Force cache refresh
curl -X POST http://localhost:3000/admin/cache/clear
```

### Issue: QuickBooks Data Conflicts

**Symptoms:**
- Revision number conflicts
- Update failures
- Data validation errors

**Error Messages:**
```
Error: Revision number mismatch
Error: Record has been modified by another user
Validation failed: duplicate entry
```

**Solutions:**
1. **Implement Proper Revision Handling:**
```javascript
// Always fetch latest revision before updates
const account = await getAccount(accountId);
await updateAccount(accountId, {
  ...updateData,
  revisionNumber: account.revisionNumber
});
```

2. **Handle Conflicts Gracefully:**
```javascript
try {
  await updateRecord(data);
} catch (error) {
  if (error.code === 'REVISION_CONFLICT') {
    // Fetch latest data and retry
    const latest = await fetchLatestRecord(data.id);
    await updateRecord({...data, revisionNumber: latest.revisionNumber});
  }
}
```

## MCP Client Integration Issues

### Issue: Claude Desktop Integration Problems

**Symptoms:**
- Tools not appearing in Claude Desktop
- Connection failures between Claude and MCP server
- Configuration errors in Claude Desktop

**Common Configuration Issues:**

1. **NPM Package Configuration (Recommended):**
```json
// ✅ Recommended - NPM package with Claude config JSON
{
  "mcpServers": {
    "QuickBooks": {
      "command": "npx",
      "args": ["-y", "@alfork/qbconductor-mcp-server@latest"],
      "env": {
        "CONDUCTOR_SECRET_KEY": "sk_prod_your_secret_key",
        "CONDUCTOR_API_KEY": "pk_prod_your_publishable_key",
        "CONDUCTOR_END_USER_ID": "end_usr_your_default_user"
      }
    }
  }
}
```

2. **Local Development Configuration:**
```json
// ✅ Alternative - Local development setup
{
  "mcpServers": {
    "qbconductor": {
      "command": "node",
      "args": ["/absolute/path/to/qbconductor-mcp-server/dist/index.js"],
      "env": {
        "CONDUCTOR_SECRET_KEY": "sk_your_secret_key",
        "CONDUCTOR_API_KEY": "pk_your_publishable_key",
        "CONDUCTOR_END_USER_ID": "end_usr_your_end_user_id"
      }
    }
  }
}
```

3. **Common Mistakes:**
```json
// ❌ Missing environment variables
{
  "mcpServers": {
    "QuickBooks": {
      "command": "npx",
      "args": ["-y", "@alfork/qbconductor-mcp-server@latest"]
    }
  }
}

// ❌ Wrong key names
{
  "mcpServers": {
    "QuickBooks": {
      "command": "npx",
      "args": ["-y", "@alfork/qbconductor-mcp-server@latest"],
      "env": {
        "CONDUCTOR_SECRET": "sk_prod_...",  // Should be CONDUCTOR_SECRET_KEY
        "CONDUCTOR_KEY": "pk_prod_..."      // Should be CONDUCTOR_API_KEY
      }
    }
  }
}
```

**Solutions:**

1. **Verify Configuration File Location:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Test Configuration:**
```bash
# Validate JSON syntax
cat ~/.config/Claude/claude_desktop_config.json | jq .

# Check MCP server configuration
jq '.mcpServers.QuickBooks' ~/.config/Claude/claude_desktop_config.json

# Verify environment variables are present
jq '.mcpServers.QuickBooks.env | keys' ~/.config/Claude/claude_desktop_config.json
```

3. **Debug Claude Desktop Connection:**
```bash
# Test NPM package installation
npx @alfork/qbconductor-mcp-server@latest --help

# Check Claude Desktop logs (if available)
# macOS:
tail -f ~/Library/Logs/Claude/claude.log

# Windows:
type %LOCALAPPDATA%\Claude\logs\claude.log

# Linux:
tail -f ~/.local/share/Claude/logs/claude.log
```

### Issue: MCP Protocol Errors

**Symptoms:**
- Protocol version mismatches
- Message format errors
- Communication failures

**Error Messages:**
```
Error: Unsupported MCP protocol version
Error: Invalid message format
Error: Protocol handshake failed
```

**Solutions:**
```bash
# 1. Update MCP SDK
npm update @modelcontextprotocol/sdk

# 2. Check protocol compatibility
node -e "console.log(require('@modelcontextprotocol/sdk/package.json').version)"

# 3. Test protocol communication
node dist/index.js --test-protocol
```

## Error Code Reference

### Authentication Errors
| Code | Description | Solution |
|------|-------------|----------|
| `AUTH_001` | Invalid API key format | Check key format (sk_...) |
| `AUTH_002` | API key expired | Regenerate API keys |
| `AUTH_003` | Insufficient permissions | Check key permissions in dashboard |
| `AUTH_004` | End-user not found | Verify end-user ID |
| `AUTH_005` | Session expired | Create new auth session |

### Connection Errors
| Code | Description | Solution |
|------|-------------|----------|
| `CONN_001` | Network timeout | Check internet connection |
| `CONN_002` | DNS resolution failed | Check DNS settings |
| `CONN_003` | SSL certificate error | Update certificates |
| `CONN_004` | QuickBooks not running | Start QuickBooks Desktop |
| `CONN_005` | Company file not accessible | Check file permissions |

### Data Errors
| Code | Description | Solution |
|------|-------------|----------|
| `DATA_001` | Validation failed | Check input parameters |
| `DATA_002` | Revision conflict | Fetch latest revision |
| `DATA_003` | Duplicate entry | Check for existing records |
| `DATA_004` | Required field missing | Provide all required fields |
| `DATA_005` | Invalid date format | Use YYYY-MM-DD format |

### System Errors
| Code | Description | Solution |
|------|-------------|----------|
| `SYS_001` | Out of memory | Increase memory limit |
| `SYS_002` | Rate limit exceeded | Implement backoff strategy |
| `SYS_003` | Cache error | Clear cache and restart |
| `SYS_004` | Configuration error | Check environment variables |
| `SYS_005` | Internal server error | Check logs for details |

## Advanced Debugging

### Enable Debug Logging

```env
# Set debug log level
LOG_LEVEL=debug

# Enable specific debug categories
DEBUG=conductor:*,mcp:*,cache:*
```

### Memory Profiling

```bash
# Start with memory profiling
node --inspect --max-old-space-size=4096 dist/index.js

# Connect Chrome DevTools
# Open chrome://inspect in Chrome browser
```

### Performance Monitoring

```javascript
// Add performance monitoring
const start = process.hrtime.bigint();
// ... operation ...
const end = process.hrtime.bigint();
console.log(`Operation took ${Number(end - start) / 1000000}ms`);
```

### Network Debugging

```bash
# Monitor network traffic
sudo tcpdump -i any host api.conductor.is

# Use verbose curl for API testing
curl -v -H "Authorization: Bearer $CONDUCTOR_SECRET_KEY" \
     https://api.conductor.is/v1/end-users
```

### Database/Cache Debugging

```bash
# Monitor cache operations
tail -f logs/qbconductor-mcp.log | grep CACHE

# Check cache statistics
curl http://localhost:3000/admin/cache/stats
```

## Getting Help

### Before Seeking Help

1. **Gather Information:**
   - Error messages and stack traces
   - Configuration files (without sensitive data)
   - Log files from the time of the issue
   - Steps to reproduce the problem

2. **Try Basic Troubleshooting:**
   - Restart the server
   - Clear cache
   - Check environment variables
   - Verify network connectivity

3. **Check Documentation:**
   - [Setup Guide](SETUP.md)
   - [API Reference](API.md)
   - [Usage Examples](EXAMPLES.md)

### Support Channels

1. **GitHub Issues:**
   - Create detailed issue reports
   - Include error logs and configuration
   - Provide steps to reproduce

2. **Conductor Support:**
   - For API-related issues
   - Access through Conductor dashboard
   - Include API request/response details

3. **Community Resources:**
   - MCP community forums
   - Stack Overflow (tag: model-context-protocol)
   - Discord/Slack communities

### Creating Effective Bug Reports

**Template:**
```markdown
## Issue Description
Brief description of the problem

## Environment
- Node.js version: 
- npm version: 
- Operating system: 
- MCP Server version: 

## Configuration
```json
{
  "mcpServers": {
    "qbconductor": {
      // Configuration (remove sensitive data)
    }
  }
}
```

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Error Messages
```
Paste error messages here
```

## Logs
```
Paste relevant log entries here
```

## Additional Context
Any other relevant information
```

### Emergency Procedures

**If the server is completely unresponsive:**
1. Kill all Node.js processes: `pkill -f node`
2. Clear cache: `rm -rf cache/*`
3. Restart with minimal configuration
4. Check system resources: `top`, `df -h`

**If data appears corrupted:**
1. Stop the server immediately
2. Backup current state
3. Clear cache completely
4. Restart with fresh cache
5. Verify data integrity

**If authentication is completely broken:**
1. Regenerate all API keys
2. Update environment variables
3. Clear authentication cache
4. Test with minimal configuration

---

*This troubleshooting guide covers the most common issues. For additional help, please refer to the other documentation files or create an issue in the GitHub repository.*
