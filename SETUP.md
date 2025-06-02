# QuickBooks Desktop MCP Server Setup Guide

This guide provides detailed instructions for setting up and configuring the QuickBooks Desktop MCP Server with the Conductor API.

> **📦 Public Repository**: This is a public repository that can be freely cloned and used without authentication. No private information is stored in the codebase.

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher
- **Operating System**: Windows, macOS, or Linux
- **Memory**: Minimum 512MB RAM available
- **Storage**: At least 100MB free space

### QuickBooks Requirements
- **QuickBooks Desktop**: Any supported version
- **Conductor Integration**: Active Conductor account and API access
- **Network Access**: Internet connection for API calls

## 🔑 Conductor API Setup

### 1. Create Conductor Account
1. Visit [Conductor.is](https://conductor.is) and sign up for an account
2. Complete the verification process
3. Access your dashboard

### 2. Generate API Keys
1. Navigate to **Settings** → **API Keys** in your Conductor dashboard
2. Click **Generate New Key**
3. Copy and securely store:
   - **Secret Key** (starts with `sk_`)
   - **Publishable Key** (starts with `pk_`)

### 3. Configure QuickBooks Integration
1. In Conductor dashboard, go to **Integrations** → **QuickBooks Desktop**
2. Follow the setup wizard to connect your QuickBooks company file
3. Note the **End-User ID** generated for your QuickBooks connection

## 🛠️ Installation Steps

### Option 1: Claude Desktop Integration (Recommended)

The easiest way to set up this server is through Claude Desktop with automatic NPM package installation:

#### 1. Locate Claude Desktop Configuration File

Find your Claude Desktop configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

#### 2. Add Server Configuration

Open the configuration file and add the QuickBooks MCP server:

```json
{
  "mcpServers": {
    "QuickBooks": {
      "command": "npx",
      "args": ["-y", "@alfork/qbconductor-mcp-server@latest"],
      "env": {
        "CONDUCTOR_SECRET_KEY": "sk_your_secret_key_here",
        "CONDUCTOR_API_KEY": "pk_your_publishable_key_here",
        "CONDUCTOR_END_USER_ID": "end_usr_your_end_user_id_here"
      }
    }
  }
}
```

#### 3. Optional Configuration

You can customize the server behavior by adding optional environment variables:

```json
{
  "mcpServers": {
    "QuickBooks": {
      "command": "npx",
      "args": ["-y", "@alfork/qbconductor-mcp-server@latest"],
      "env": {
        "CONDUCTOR_SECRET_KEY": "sk_your_secret_key_here",
        "CONDUCTOR_API_KEY": "pk_your_publishable_key_here",
        "CONDUCTOR_END_USER_ID": "end_usr_your_end_user_id_here",
        "CONDUCTOR_API_BASE_URL": "https://api.conductor.is/v1",
        "LOG_LEVEL": "info",
        "CACHE_TTL_MINUTES": "30",
        "CACHE_MAX_SIZE": "1000",
        "DISABLED_TOOLS": "passthrough_request,bulk_operations"
      }
    }
  }
}
```

#### 4. Restart Claude Desktop

Save the configuration file and restart Claude Desktop. The server will be automatically installed and configured when Claude Desktop starts.

### Option 2: Local Development Setup

For local development, custom deployment, or other MCP clients:

#### 1. Clone and Install
```bash
# Clone the repository (No authentication required - public repository)
git clone https://github.com/alfork/qbconductor-mcp-server.git
cd qbconductor-mcp-server

# Install dependencies
npm install

# Verify installation
npm run build
```

#### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env  # or your preferred editor
```

#### 3. Configure Environment Variables
Edit your `.env` file with the following values:

```env
# Required: Conductor API Credentials
CONDUCTOR_SECRET_KEY=sk_your_secret_key_here
CONDUCTOR_API_KEY=pk_your_publishable_key_here

# Optional: Default end-user (recommended)
CONDUCTOR_END_USER_ID=end_usr_your_end_user_id_here

# Optional: API Configuration
CONDUCTOR_API_BASE_URL=https://api.conductor.is/v1

# Optional: Logging and Performance
LOG_LEVEL=info
CACHE_TTL_MINUTES=30
CACHE_MAX_SIZE=1000
```

#### 4. Verify Configuration
```bash
# Test the configuration
npm run test:config

# Build the project
npm run build

# Test basic functionality
npm run test:connection
```

## 🔧 MCP Client Integration

### Claude Desktop Configuration (Recommended)

If you used Option 1 above, your Claude Desktop is already configured. If you need to modify the configuration or used Option 2, follow these steps:

**Configuration File Location:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

**NPM Package Configuration (After Publishing):**
```json
{
  "mcpServers": {
    "QuickBooks": {
      "command": "npx",
      "args": ["-y", "@alfork/qbconductor-mcp-server@latest"],
      "env": {
        "CONDUCTOR_SECRET_KEY": "sk_your_secret_key_here",
        "CONDUCTOR_API_KEY": "pk_your_publishable_key_here",
        "CONDUCTOR_END_USER_ID": "end_usr_your_end_user_id_here"
      }
    }
  }
}
```

> **Note**: The NPM package needs to be published first. Until then, use the local development configuration below.

**Local Development Configuration:**
```json
{
  "mcpServers": {
    "qbconductor": {
      "command": "node",
      "args": ["/absolute/path/to/qbconductor-mcp-server/dist/index.js"],
      "env": {
        "CONDUCTOR_SECRET_KEY": "sk_your_secret_key_here",
        "CONDUCTOR_API_KEY": "pk_your_publishable_key_here",
        "CONDUCTOR_END_USER_ID": "end_usr_your_end_user_id_here"
      }
    }
  }
}
```

### Other MCP Clients

For other MCP-compatible clients, use the following connection details:
- **Transport**: stdio
- **Command**: `node /path/to/qbconductor-mcp-server/dist/index.js`
- **Environment**: Include all required environment variables

## 🧪 Testing Your Setup

### 1. Claude Desktop Testing (Recommended)

If you configured the server through Claude Desktop:

1. **Restart Claude Desktop** after adding the configuration
2. **Start a new conversation** in Claude Desktop
3. **Test basic connectivity** with these commands:

```
"List all accounts in QuickBooks"
"Show me recent bills"
"Check connection status"
```

### 2. Verify Tool Availability
In Claude, ask: "What QuickBooks tools are available?"

You should see all 22 tools listed, including:
- End-user management tools
- Authentication tools
- Account management tools
- Bill and payment processing tools
- Reporting and analysis tools

### 3. Local Development Testing

If you're using local development setup:

```bash
# Test Conductor API connectivity
npm run test:conductor

# Test MCP server startup
npm run test:mcp
```

### 4. Configuration Validation

Test your configuration with these Claude commands:

```
"Test the QuickBooks connection"
"Show me my QuickBooks company information"
"List the first 5 accounts"
```

If these commands work successfully, your setup is complete!

## 🔍 Troubleshooting

### Common Issues

#### 1. "Authentication Failed" Error
**Symptoms**: API calls return 401 Unauthorized
**Solutions**:
- Verify your `CONDUCTOR_SECRET_KEY` is correct
- Check that your Conductor account is active
- Ensure the API key has proper permissions

#### 2. "End-User Not Found" Error
**Symptoms**: Operations fail with end-user errors
**Solutions**:
- Verify your `CONDUCTOR_END_USER_ID` is correct
- Check that the end-user has an active QuickBooks connection
- Try creating a new end-user through the Conductor dashboard

#### 3. "Connection Timeout" Error
**Symptoms**: API calls timeout or fail intermittently
**Solutions**:
- Check your internet connection
- Verify the `CONDUCTOR_BASE_URL` is correct
- Increase timeout values in configuration

#### 4. "Module Not Found" Error
**Symptoms**: Server fails to start with import errors
**Solutions**:
- Run `npm install` to ensure all dependencies are installed
- Verify Node.js version is 18 or higher
- Check that the build completed successfully with `npm run build`

### Debug Mode

Enable detailed logging for troubleshooting:
```env
LOG_LEVEL=debug
```

This will provide detailed information about:
- API requests and responses
- Cache operations
- Error details and stack traces
- Performance metrics

### Log Analysis

Check the server logs for detailed error information:
```bash
# View recent logs
tail -f logs/qbconductor-mcp.log

# Search for errors
grep "ERROR" logs/qbconductor-mcp.log
```

## 🔒 Security Best Practices

### 1. API Key Security
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Restrict API key permissions to minimum required

### 2. Network Security
- Use HTTPS for all API communications
- Consider firewall rules for production deployments
- Monitor API usage for unusual patterns

### 3. Access Control
- Limit end-user access to necessary QuickBooks data
- Implement proper authentication in production
- Regular audit of user permissions

## 📊 Performance Optimization

### 1. Caching Configuration
Optimize cache settings based on your usage:
```env
# For high-frequency usage
CACHE_TTL_MINUTES=60
CACHE_MAX_SIZE=2000

# For low-frequency usage
CACHE_TTL_MINUTES=15
CACHE_MAX_SIZE=500
```

### 2. API Rate Limiting
The server includes built-in rate limiting. Monitor usage and adjust if needed:
- Default: 100 requests per minute per end-user
- Conductor API limits: Check your plan limits

### 3. Memory Management
For production deployments:
- Monitor memory usage
- Consider process restart schedules
- Implement health checks

## 🚀 Production Deployment

### 1. Environment Setup
```bash
# Production environment variables
NODE_ENV=production
LOG_LEVEL=warn
CACHE_TTL_MINUTES=60
```

### 2. Process Management
Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start dist/index.js --name qbconductor-mcp
pm2 startup
pm2 save
```

### 3. Monitoring
Implement monitoring for:
- Server uptime
- API response times
- Error rates
- Memory and CPU usage

## 📞 Support

If you encounter issues not covered in this guide:

1. **Check the logs** for detailed error information
2. **Review the API documentation** at [docs.conductor.is](https://docs.conductor.is)
3. **Create an issue** in this repository with:
   - Error messages and logs
   - Your configuration (without sensitive data)
   - Steps to reproduce the issue
4. **Contact support** through your Conductor dashboard for API-related issues

## 📚 Additional Resources

- [Conductor API Documentation](https://docs.conductor.is/api-ref/welcome)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/introduction)
- [QuickBooks Desktop Integration Guide](https://docs.conductor.is/quickbooks-desktop)
- [MCP Client Configuration Examples](https://modelcontextprotocol.io/clients)
