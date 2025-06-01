# QuickBooks Desktop MCP Server

A comprehensive Model Context Protocol (MCP) server that provides Claude with direct access to QuickBooks Desktop operations through the Conductor API. This server enables natural language interactions with QuickBooks for financial management, bill processing, payment handling, and comprehensive reporting.

## 🚀 Features

### Core Capabilities
- **End-User Management**: Create and manage QuickBooks end-users
- **Authentication Flow**: Handle QuickBooks Desktop authentication sessions
- **Account Management**: Full CRUD operations for chart of accounts
- **Bill Processing**: Create, update, and manage vendor bills with line items
- **Payment Processing**: Handle check and credit card payments for bills
- **Financial Reporting**: Generate summaries and analyze vendor spending patterns
- **Advanced Operations**: Direct API access and bulk operations

### Technical Features
- **Multi-Tenant Support**: Handle multiple QuickBooks companies
- **Robust Caching**: Local caching system to optimize slow Conductor API calls
- **Comprehensive Error Handling**: Retry logic and detailed error messages
- **Input Validation**: Zod-based schema validation for all operations
- **Financial Formatting**: Proper currency display and amount handling
- **Pagination Support**: Cursor-based navigation for large datasets

## 📋 Prerequisites

- Node.js 18+ and npm
- QuickBooks Desktop with Conductor integration
- Conductor API credentials (secret key, publishable key)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alfork/qbconductor-mcp-server.git
   cd qbconductor-mcp-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Conductor API credentials:
   ```env
   CONDUCTOR_SECRET_KEY=your_secret_key_here
   CONDUCTOR_PUBLISHABLE_KEY=your_publishable_key_here
   CONDUCTOR_END_USER_ID=your_default_end_user_id
   CONDUCTOR_BASE_URL=https://api.conductor.is/v1
   LOG_LEVEL=info
   CACHE_TTL_MINUTES=30
   CACHE_MAX_SIZE=1000
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `CONDUCTOR_SECRET_KEY` | Conductor API secret key | Yes | - |
| `CONDUCTOR_PUBLISHABLE_KEY` | Conductor API publishable key | Yes | - |
| `CONDUCTOR_END_USER_ID` | Default end-user ID for operations | No | - |
| `CONDUCTOR_BASE_URL` | Conductor API base URL | No | `https://api.conductor.is/v1` |
| `LOG_LEVEL` | Logging level (debug, info, warn, error) | No | `info` |
| `CACHE_TTL_MINUTES` | Cache time-to-live in minutes | No | `30` |
| `CACHE_MAX_SIZE` | Maximum number of cached items | No | `1000` |

### MCP Client Configuration

Add this server to your MCP client configuration:

```json
{
  "mcpServers": {
    "qbconductor": {
      "command": "node",
      "args": ["/path/to/qbconductor-mcp-server/dist/index.js"],
      "env": {
        "CONDUCTOR_SECRET_KEY": "your_secret_key",
        "CONDUCTOR_PUBLISHABLE_KEY": "your_publishable_key",
        "CONDUCTOR_END_USER_ID": "your_end_user_id"
      }
    }
  }
}
```

## 🎯 Available Tools

### End-User Management
- `create_end_user` - Create new QuickBooks end-users
- `list_end_users` - List all end-users
- `get_end_user` - Retrieve specific end-user details
- `delete_end_user` - Remove end-users

### Authentication
- `create_auth_session` - Generate QuickBooks authentication URLs
- `check_connection_status` - Verify end-user connection status

### Account Management
- `list_accounts` - Get chart of accounts with filtering
- `get_account` - Retrieve account details
- `create_account` - Create new financial accounts
- `update_account` - Modify existing accounts

### Bill Management
- `list_bills` - Retrieve bills with comprehensive filtering
- `get_bill` - Retrieve specific bill details
- `create_bill` - Create new vendor bills with line items
- `update_bill` - Modify existing bills

### Payment Processing
- `list_bill_check_payments` - Get check payments for bills
- `list_bill_credit_card_payments` - Get credit card payments
- `create_bill_check_payment` - Process bill payments via check
- `create_bill_credit_card_payment` - Process credit card bill payments
- `update_payment` - Modify existing payments
- `delete_payment` - Remove payments

### Reporting & Analysis
- `get_account_tax_lines` - Retrieve tax line information
- `generate_financial_summary` - Aggregate financial data across accounts
- `get_vendor_spending_analysis` - Analyze spending by vendor

### Advanced Operations
- `passthrough_request` - Direct API calls for custom operations
- `bulk_operations` - Batch processing for multiple transactions

## 💡 Usage Examples

### Basic Account Operations
```
Claude: "Show me all expense accounts in QuickBooks"
→ Uses: list_accounts with accountType filter

Claude: "Create a new expense account called 'Marketing Software'"
→ Uses: create_account with proper account details
```

### Bill Management
```
Claude: "Show me all unpaid bills from this month"
→ Uses: list_bills with date range and payment status filters

Claude: "Create a bill for $500 from Office Depot for office supplies"
→ Uses: create_bill with vendor and line item details
```

### Payment Processing
```
Claude: "Pay the Office Depot bill via check from our main checking account"
→ Uses: create_bill_check_payment with account and bill references

Claude: "Show me all payments made to vendors this quarter"
→ Uses: list_bill_check_payments and list_bill_credit_card_payments
```

### Financial Analysis
```
Claude: "Generate a financial summary for all expense accounts"
→ Uses: generate_financial_summary with account type filtering

Claude: "Analyze our spending by vendor for the last 6 months"
→ Uses: get_vendor_spending_analysis with date range
```

## 🏗️ Architecture

### Project Structure
```
src/
├── config.ts                 # Configuration management
├── logger.ts                 # Logging setup
├── index.ts                  # Server entry point
├── server.ts                 # MCP server implementation
├── services/
│   ├── conductor-client.ts   # Conductor API client
│   └── cache-service.ts      # Local caching service
├── schemas/
│   ├── conductor-types.ts    # Conductor API type definitions
│   └── mcp-schemas.ts        # MCP input validation schemas
├── utils/
│   ├── validation.ts         # Input validation utilities
│   ├── formatting.ts         # Response formatting utilities
│   └── error-handling.ts     # Error handling utilities
└── tools/
    ├── index.ts              # Tool registry
    ├── end-users.ts          # End-user management tools
    ├── auth.ts               # Authentication tools
    ├── accounts.ts           # Account management tools
    ├── bills.ts              # Bill management tools
    ├── payments.ts           # Payment processing tools
    ├── reporting.ts          # Reporting and analysis tools
    └── advanced.ts           # Advanced operation tools
```

### Key Components

#### Conductor Client
- Direct REST API integration with Conductor
- Automatic retry logic for transient failures
- Comprehensive error handling and logging
- Built-in caching for performance optimization

#### Cache Service
- Local caching to reduce API calls
- Configurable TTL and size limits
- Pattern-based cache invalidation
- Performance monitoring and statistics

#### Input Validation
- Zod-based schema validation for all tools
- Type-safe parameter handling
- Comprehensive error messages for invalid inputs

#### Response Formatting
- Consistent response structure across all tools
- Financial amount formatting with currency display
- Metadata inclusion (timestamps, IDs, revision numbers)
- List formatting with summaries and pagination info

## 🔒 Security

- **API Key Management**: Secure environment variable handling
- **Input Sanitization**: Comprehensive validation of all inputs
- **Error Handling**: No sensitive data exposure in error messages
- **Multi-Tenant Isolation**: Proper end-user context management

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Build and verify:
```bash
npm run build
npm run lint
```

## 📚 API Reference

### Tool Input Schemas

All tools accept parameters according to their defined schemas. Common parameters include:

- `endUserId` (optional): Override default end-user for multi-tenant scenarios
- Date filters: Use `YYYY-MM-DD` format for date ranges
- Pagination: Cursor-based navigation for large result sets
- Filtering: Support for various QuickBooks filtering patterns

### Response Format

All tools return responses in this format:
```json
{
  "success": true,
  "data": { /* tool-specific data */ },
  "metadata": {
    "endUserId": "user_123",
    "timestamp": "2024-01-01T00:00:00Z",
    "totalCount": 10,
    /* additional metadata */
  }
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": { /* additional error context */ }
  }
}
```

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
CMD ["node", "dist/index.js"]
```

## 📖 Documentation

- [Setup Guide](SETUP.md) - Detailed installation and configuration instructions
- [Contributing Guide](CONTRIBUTING.md) - Guidelines for contributors
- [API Reference](API.md) - Comprehensive API documentation
- [Examples](EXAMPLES.md) - Usage examples and integration patterns
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Review the [Conductor API documentation](https://docs.conductor.is/api-ref/welcome)
- Check the [MCP specification](https://modelcontextprotocol.io/introduction)

## 🔗 Related Projects

- [Conductor API Documentation](https://docs.conductor.is/api-ref/welcome)
- [Model Context Protocol](https://modelcontextprotocol.io/introduction)
- [ClickUp MCP Server](https://github.com/taazkareem/clickup-mcp-server) (Reference implementation)
