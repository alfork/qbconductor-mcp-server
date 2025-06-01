# QuickBooks Desktop MCP Server Usage Examples

This guide provides practical examples and integration patterns for using the QuickBooks Desktop MCP Server with Claude and other MCP clients.

## Table of Contents

- [Quick Start Examples](#quick-start-examples)
- [Common Workflows](#common-workflows)
- [Integration Patterns](#integration-patterns)
- [Advanced Use Cases](#advanced-use-cases)
- [Error Handling Examples](#error-handling-examples)
- [Performance Optimization](#performance-optimization)
- [Multi-Tenant Scenarios](#multi-tenant-scenarios)

## Quick Start Examples

### Basic Connection Test

First, verify your QuickBooks connection:

```
"Check my QuickBooks connection status"
```

**Expected Response:**
```
Your QuickBooks Desktop connection is active:
- Company: Acme Corporation
- Last sync: 2024-01-15 10:30 AM
- QuickBooks version: QuickBooks Desktop Pro 2024
```

### List All Accounts

View your chart of accounts:

```
"Show me all accounts in QuickBooks"
```

**Expected Response:**
```
Found 25 accounts in your QuickBooks company:

Assets:
- Checking Account (1000) - Balance: $15,250.00
- Savings Account (1010) - Balance: $5,000.00
- Accounts Receivable (1200) - Balance: $8,750.00

Expenses:
- Office Supplies (6100) - Balance: $1,250.00
- Utilities (6200) - Balance: $850.00
```

### View Recent Bills

Check recent vendor bills:

```
"Show me all unpaid bills from this month"
```

**Expected Response:**
```
Found 3 unpaid bills from January 2024:

1. Office Depot - $171.25 (Due: Jan 30, 2024)
   - Reference: INV-2024-001
   - Items: Printer paper and ink ($125.50), Pens and notebooks ($45.75)

2. Electric Company - $285.50 (Due: Jan 25, 2024)
   - Reference: ELEC-JAN-2024
   - Items: Monthly electricity ($285.50)

Total unpaid: $456.75
```

## Common Workflows

### 1. Complete Bill Processing Workflow

#### Step 1: Create a New Bill
```
"Create a new bill for Office Depot with reference number INV-2024-002, dated January 20, 2024, due February 20, 2024. Add line items: Office supplies for $125.50 and Printer cartridges for $89.75"
```

#### Step 2: Review the Created Bill
```
"Show me the details of the bill I just created for Office Depot"
```

#### Step 3: Pay the Bill
```
"Pay the Office Depot bill INV-2024-002 in full using check number 1001 from our main checking account, dated January 22, 2024"
```

#### Step 4: Verify Payment
```
"Show me all payments made to Office Depot this month"
```

### 2. Monthly Financial Review Workflow

#### Step 1: Generate Expense Summary
```
"Generate a financial summary for all expenses from January 1 to January 31, 2024, grouped by month"
```

#### Step 2: Analyze Vendor Spending
```
"Analyze vendor spending from January 1 to January 31, 2024, sorted by amount"
```

#### Step 3: Review Account Balances
```
"Show me all expense accounts with their current balances"
```

### 3. Account Management Workflow

#### Step 1: Create New Account
```
"Create a new expense account called 'Marketing Expenses' with account number 6300"
```

#### Step 2: Update Account Description
```
"Update the Marketing Expenses account to include the description 'Advertising, promotions, and marketing materials'"
```

#### Step 3: Verify Account Creation
```
"Show me the details of the Marketing Expenses account"
```

## Integration Patterns

### Claude Desktop Integration

#### Configuration Example
```json
{
  "mcpServers": {
    "qbconductor": {
      "command": "node",
      "args": ["/path/to/qbconductor-mcp-server/dist/index.js"],
      "env": {
        "CONDUCTOR_SECRET_KEY": "sk_your_secret_key",
        "CONDUCTOR_PUBLISHABLE_KEY": "pk_your_publishable_key",
        "CONDUCTOR_END_USER_ID": "user_your_end_user_id"
      }
    }
  }
}
```

#### Natural Language Queries
```
"What's my total spending on office supplies this quarter?"
"Create a bill for $500 from ABC Vendor for consulting services"
"Pay all bills due this week using our main checking account"
"Show me which vendors I spend the most money with"
```

### Custom MCP Client Integration

#### Python Client Example
```python
import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def quickbooks_operations():
    server_params = StdioServerParameters(
        command="node",
        args=["/path/to/qbconductor-mcp-server/dist/index.js"],
        env={
            "CONDUCTOR_SECRET_KEY": "sk_your_secret_key",
            "CONDUCTOR_PUBLISHABLE_KEY": "pk_your_publishable_key",
            "CONDUCTOR_END_USER_ID": "user_your_end_user_id"
        }
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the session
            await session.initialize()
            
            # List available tools
            tools = await session.list_tools()
            print(f"Available tools: {[tool.name for tool in tools.tools]}")
            
            # Check connection status
            result = await session.call_tool("check_connection_status", {})
            print(f"Connection status: {result.content}")
            
            # List recent bills
            bills = await session.call_tool("list_bills", {
                "dateFrom": "2024-01-01",
                "dateTo": "2024-01-31",
                "isPaid": False
            })
            print(f"Unpaid bills: {bills.content}")

# Run the example
asyncio.run(quickbooks_operations())
```

### Web Application Integration

#### Express.js Server Example
```javascript
import express from 'express';
import { spawn } from 'child_process';

const app = express();
app.use(express.json());

class QuickBooksService {
    constructor() {
        this.mcpProcess = spawn('node', ['/path/to/qbconductor-mcp-server/dist/index.js'], {
            stdio: ['pipe', 'pipe', 'pipe'],
            env: {
                ...process.env,
                CONDUCTOR_SECRET_KEY: process.env.CONDUCTOR_SECRET_KEY,
                CONDUCTOR_PUBLISHABLE_KEY: process.env.CONDUCTOR_PUBLISHABLE_KEY,
                CONDUCTOR_END_USER_ID: process.env.CONDUCTOR_END_USER_ID
            }
        });
    }
    
    async callTool(toolName, parameters) {
        const request = {
            jsonrpc: "2.0",
            id: Date.now(),
            method: "tools/call",
            params: {
                name: toolName,
                arguments: parameters
            }
        };
        
        return new Promise((resolve, reject) => {
            this.mcpProcess.stdin.write(JSON.stringify(request) + '\n');
            
            this.mcpProcess.stdout.once('data', (data) => {
                try {
                    const response = JSON.parse(data.toString());
                    resolve(response.result);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}

const qbService = new QuickBooksService();

// API endpoint to get bills
app.get('/api/bills', async (req, res) => {
    try {
        const { dateFrom, dateTo, isPaid } = req.query;
        const result = await qbService.callTool('list_bills', {
            dateFrom,
            dateTo,
            isPaid: isPaid === 'true'
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to create bills
app.post('/api/bills', async (req, res) => {
    try {
        const result = await qbService.callTool('create_bill', req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('QuickBooks API server running on port 3000');
});
```

## Advanced Use Cases

### 1. Automated Bill Processing

#### Scenario: Process Multiple Bills from Email Attachments

```
"I have 5 bills to enter:
1. Office Depot - $125.50 for office supplies, dated Jan 15, due Feb 15
2. Electric Company - $285.50 for utilities, dated Jan 10, due Jan 30
3. Internet Provider - $89.99 for internet service, dated Jan 12, due Feb 12
4. Phone Company - $156.75 for phone service, dated Jan 8, due Feb 8
5. Cleaning Service - $200.00 for janitorial services, dated Jan 20, due Feb 20

Create all these bills and then show me a summary of what was created."
```

**Expected Workflow:**
1. Server creates each bill individually
2. Validates vendor information
3. Assigns appropriate expense accounts
4. Provides summary of all created bills

### 2. Financial Reporting and Analysis

#### Scenario: Quarterly Business Review

```
"Generate a comprehensive financial analysis for Q1 2024 including:
- Total expenses by category
- Top 10 vendors by spending
- Monthly expense trends
- Accounts with unusual activity"
```

**Multi-Step Process:**
1. Generate financial summary for Q1
2. Analyze vendor spending patterns
3. Compare monthly trends
4. Identify outliers and unusual patterns

### 3. Multi-Company Management

#### Scenario: Managing Multiple QuickBooks Companies

```python
# Example for switching between companies
async def multi_company_operations():
    companies = [
        {"name": "Company A", "endUserId": "user_company_a"},
        {"name": "Company B", "endUserId": "user_company_b"},
        {"name": "Company C", "endUserId": "user_company_c"}
    ]
    
    for company in companies:
        # Check connection for each company
        result = await session.call_tool("check_connection_status", {
            "endUserId": company["endUserId"]
        })
        
        # Get unpaid bills for each company
        bills = await session.call_tool("list_bills", {
            "endUserId": company["endUserId"],
            "isPaid": False
        })
        
        print(f"{company['name']}: {len(bills.data.bills)} unpaid bills")
```

### 4. Bulk Operations

#### Scenario: Process Multiple Payments

```
"Pay all bills due this week using the following strategy:
- Bills under $100: Pay with credit card
- Bills over $100: Pay with check from main checking account
- Use today's date for all payments"
```

**Implementation using bulk_operations:**
```json
{
  "operations": [
    {
      "id": "payment_1",
      "operation": "create_bill_check_payment",
      "parameters": {
        "bankAccountId": "account_checking_main",
        "paymentDate": "2024-01-22",
        "billPayments": [
          {"billId": "bill_123", "amount": 285.50}
        ]
      }
    },
    {
      "id": "payment_2",
      "operation": "create_bill_credit_card_payment",
      "parameters": {
        "creditCardAccountId": "account_credit_card",
        "paymentDate": "2024-01-22",
        "billPayments": [
          {"billId": "bill_124", "amount": 89.99}
        ]
      }
    }
  ]
}
```

## Error Handling Examples

### 1. Authentication Errors

#### Problem: Invalid API Key
```
"Check my QuickBooks connection"
```

**Error Response:**
```
Error: Authentication failed. Please check your Conductor API credentials.
- Verify CONDUCTOR_SECRET_KEY is correct
- Ensure your Conductor account is active
- Check that the API key has proper permissions
```

#### Solution:
1. Verify environment variables
2. Check Conductor dashboard for API key status
3. Regenerate API keys if necessary

### 2. Data Validation Errors

#### Problem: Invalid Bill Data
```
"Create a bill for XYZ Vendor with amount -100"
```

**Error Response:**
```
Error: Invalid bill data provided.
- Amount must be positive
- Vendor name is required
- At least one line item is required
```

#### Solution:
```
"Create a bill for XYZ Vendor dated January 15, 2024, with line item: Consulting services for $500"
```

### 3. QuickBooks Connection Errors

#### Problem: QuickBooks Not Connected
```
"List all accounts"
```

**Error Response:**
```
Error: QuickBooks connection not found for end-user.
- End-user may not have completed QuickBooks authentication
- QuickBooks company file may be closed
- Connection may have expired
```

#### Solution:
1. Create new authentication session
2. Guide user through QuickBooks connection process
3. Verify QuickBooks Desktop is running

### 4. Rate Limiting

#### Problem: Too Many Requests
```
Error: Rate limit exceeded (100 requests per minute).
- Current usage: 105 requests in the last minute
- Reset time: 2024-01-22T10:31:00Z
- Retry after: 45 seconds
```

#### Solution:
- Implement exponential backoff
- Use bulk operations for multiple requests
- Cache frequently accessed data

## Performance Optimization

### 1. Caching Strategies

#### Effective Caching Usage
```
# First request - data fetched from API
"Show me all accounts"  # Takes 2-3 seconds

# Subsequent requests - data served from cache
"Show me all expense accounts"  # Takes <100ms
"Show me account details for Office Supplies"  # Takes <100ms
```

#### Cache Management
```
# Clear cache when data changes
"Create a new account called 'New Expense Account'"
# Cache automatically invalidated for account-related data

# Manual cache verification
"Check connection status with detailed information"
# Forces fresh API call and updates cache
```

### 2. Efficient Querying

#### Use Specific Filters
```
# Inefficient - retrieves all bills
"Show me all bills"

# Efficient - filtered query
"Show me unpaid bills from this month for Office Depot"
```

#### Pagination for Large Datasets
```
# For large result sets
"Show me the first 20 bills from this year, then show me the next 20"
```

### 3. Bulk Operations

#### Process Multiple Items Efficiently
```
# Instead of multiple individual requests
"Create bill 1, create bill 2, create bill 3..."

# Use bulk operations
"Create these 3 bills in a single operation: [bill details...]"
```

## Multi-Tenant Scenarios

### 1. Switching Between Companies

#### Explicit End-User Override
```
"For company ABC (end-user: user_abc123), show me all unpaid bills"
"For company XYZ (end-user: user_xyz789), create a new expense account"
```

### 2. Comparative Analysis

#### Cross-Company Reporting
```python
async def compare_companies():
    companies = ["user_company_a", "user_company_b"]
    results = {}
    
    for company in companies:
        # Get expense summary for each company
        summary = await session.call_tool("generate_financial_summary", {
            "endUserId": company,
            "dateFrom": "2024-01-01",
            "dateTo": "2024-03-31",
            "accountTypes": ["Expense"]
        })
        results[company] = summary.data.summary.totalExpenses
    
    return results
```

### 3. End-User Management

#### Create and Manage Multiple End-Users
```
"Create a new end-user for Acme Corporation with email admin@acme.com"
"List all end-users and their connection status"
"Delete the end-user for the old company that closed"
```

## Best Practices

### 1. Error Handling
- Always check connection status before operations
- Implement retry logic for transient failures
- Validate input data before API calls
- Handle rate limiting gracefully

### 2. Performance
- Use caching for frequently accessed data
- Implement pagination for large datasets
- Use bulk operations when possible
- Monitor API usage and optimize queries

### 3. Security
- Never log or expose API keys
- Use environment variables for configuration
- Implement proper end-user isolation
- Audit financial operations

### 4. Data Integrity
- Always use revision numbers for updates
- Validate financial amounts and dates
- Implement proper error recovery
- Maintain audit trails

## Troubleshooting Common Issues

### Issue: "Tool not found" errors
**Solution:** Verify MCP server is running and tools are properly registered

### Issue: Slow response times
**Solution:** Check cache configuration and network connectivity

### Issue: Authentication failures
**Solution:** Verify API keys and end-user configuration

### Issue: Data inconsistencies
**Solution:** Clear cache and verify QuickBooks connection

## Additional Resources

- [Setup Guide](SETUP.md) - Installation and configuration
- [API Reference](API.md) - Complete tool documentation
- [Troubleshooting Guide](TROUBLESHOOTING.md) - Common problems and solutions
- [Conductor API Documentation](https://docs.conductor.is/api-ref/welcome) - Official API reference

---

*These examples demonstrate the power and flexibility of the QuickBooks Desktop MCP Server. For more specific use cases or custom implementations, refer to the API documentation and feel free to experiment with different tool combinations.*
