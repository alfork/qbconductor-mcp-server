# QuickBooks Desktop MCP Server API Reference

This document provides comprehensive API reference documentation for all tools available in the QuickBooks Desktop MCP Server.

## Table of Contents

- [Overview](#overview)
- [Configuration](#configuration)
- [Common Parameters](#common-parameters)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [End-User Management](#end-user-management)
- [Authentication](#authentication)
- [Account Management](#account-management)
- [Bill Management](#bill-management)
- [Payment Processing](#payment-processing)
- [Reporting & Analysis](#reporting--analysis)
- [Advanced Operations](#advanced-operations)

## Overview

The QuickBooks Desktop MCP Server provides 22 specialized tools for interacting with QuickBooks Desktop through the Conductor API. All tools follow consistent patterns for input validation, error handling, and response formatting.

### Tool Categories

1. **End-User Management** (4 tools): Manage QuickBooks end-users
2. **Authentication** (2 tools): Handle authentication sessions
3. **Account Management** (4 tools): Manage chart of accounts
4. **Bill Management** (4 tools): Handle vendor bills
5. **Payment Processing** (6 tools): Process bill payments
6. **Reporting & Analysis** (3 tools): Generate financial reports
7. **Advanced Operations** (2 tools): Direct API access and bulk operations

## Configuration

### Claude Desktop Integration (Recommended)

The MCP server is designed to work seamlessly with Claude Desktop using NPM package configuration:

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

### Required Configuration Variables

| Variable | Description | Format |
|----------|-------------|---------|
| `CONDUCTOR_SECRET_KEY` | Conductor API secret key | `sk_prod_...` or `sk_test_...` |
| `CONDUCTOR_API_KEY` | Conductor API publishable key | `pk_prod_...` or `pk_test_...` |
| `CONDUCTOR_END_USER_ID` | Default end-user ID | `end_usr_...` |

### Optional Configuration Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CONDUCTOR_API_BASE_URL` | Conductor API base URL | `https://api.conductor.is/v1` |
| `LOG_LEVEL` | Logging level | `info` |
| `CACHE_TTL_MINUTES` | Cache time-to-live in minutes | `1440` |
| `CACHE_MAX_SIZE` | Maximum cache entries | `1000` |
| `DISABLED_TOOLS` | Comma-separated list of tools to disable | `` |

### Alternative: Environment Variables

For local development or custom deployments, you can use environment variables instead of Claude config JSON. See the [Setup Guide](SETUP.md) for details.

## Common Parameters

### Optional Parameters (Available on All Tools)

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `endUserId` | string | Override default end-user for multi-tenant scenarios | From environment |

### Date Format

All date parameters use ISO 8601 format: `YYYY-MM-DD`

### Pagination

Tools that return lists support cursor-based pagination:

| Parameter | Type | Description |
|-----------|------|-------------|
| `cursor` | string | Pagination cursor for next page |
| `limit` | number | Maximum number of items to return (1-100) |

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Tool-specific data
  },
  "metadata": {
    "endUserId": "user_123",
    "timestamp": "2024-01-01T00:00:00Z",
    "totalCount": 10,
    "hasMore": false,
    "cursor": "next_page_cursor"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": {
      "field": "Additional error context"
    }
  }
}
```

## Error Handling

### Common Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `AUTHENTICATION_FAILED` | Invalid API credentials | Check CONDUCTOR_SECRET_KEY in Claude config JSON or environment |
| `END_USER_NOT_FOUND` | End-user ID not found | Verify CONDUCTOR_END_USER_ID in Claude config JSON or environment |
| `VALIDATION_ERROR` | Invalid input parameters | Check parameter format and requirements |
| `QUICKBOOKS_ERROR` | QuickBooks-specific error | Check QuickBooks connection and data |
| `RATE_LIMIT_EXCEEDED` | Too many API requests | Wait and retry with exponential backoff |
| `NETWORK_ERROR` | Connection timeout or failure | Check internet connection |

## End-User Management

### create_end_user

Creates a new QuickBooks end-user for multi-tenant scenarios.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "companyName": {
      "type": "string",
      "description": "Name of the QuickBooks company"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "Email address for the end-user"
    },
    "metadata": {
      "type": "object",
      "description": "Additional metadata for the end-user"
    }
  },
  "required": ["companyName", "email"]
}
```

**Example Usage:**
```json
{
  "companyName": "Acme Corporation",
  "email": "admin@acme.com",
  "metadata": {
    "department": "Accounting",
    "region": "North America"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_abc123",
    "companyName": "Acme Corporation",
    "email": "admin@acme.com",
    "status": "created",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### list_end_users

Retrieves a list of all end-users with optional filtering.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "number",
      "minimum": 1,
      "maximum": 100,
      "description": "Maximum number of end-users to return"
    },
    "cursor": {
      "type": "string",
      "description": "Pagination cursor for next page"
    },
    "status": {
      "type": "string",
      "enum": ["active", "inactive", "pending"],
      "description": "Filter by end-user status"
    }
  }
}
```

### get_end_user

Retrieves details for a specific end-user.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "userId": {
      "type": "string",
      "description": "ID of the end-user to retrieve"
    }
  },
  "required": ["userId"]
}
```

### delete_end_user

Removes an end-user and their associated data.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "userId": {
      "type": "string",
      "description": "ID of the end-user to delete"
    },
    "force": {
      "type": "boolean",
      "description": "Force deletion even if user has active connections",
      "default": false
    }
  },
  "required": ["userId"]
}
```

## Authentication

The MCP server handles authentication automatically using the configured Conductor API credentials. All tools require valid authentication to function properly.

### Authentication Flow

1. **Configuration**: Set up credentials in Claude Desktop config JSON or environment variables
2. **Connection**: Use `create_auth_session` to generate QuickBooks authentication URLs
3. **Verification**: Use `check_connection_status` to verify end-user connections
4. **Usage**: All other tools automatically use the configured authentication

### create_auth_session

Generates a QuickBooks authentication URL for end-user connection.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "redirectUri": {
      "type": "string",
      "format": "uri",
      "description": "URL to redirect after authentication"
    },
    "state": {
      "type": "string",
      "description": "Optional state parameter for security"
    }
  },
  "required": ["redirectUri"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authUrl": "https://conductor.is/auth/quickbooks?session=abc123",
    "sessionId": "session_abc123",
    "expiresAt": "2024-01-01T01:00:00Z"
  }
}
```

### check_connection_status

Verifies the connection status for an end-user's QuickBooks integration.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "detailed": {
      "type": "boolean",
      "description": "Include detailed connection information",
      "default": false
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "connected",
    "companyName": "Acme Corporation",
    "lastSync": "2024-01-01T00:00:00Z",
    "quickbooksVersion": "QuickBooks Desktop Pro 2024"
  }
}
```

## Account Management

### list_accounts

Retrieves chart of accounts with comprehensive filtering options.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "accountType": {
      "type": "string",
      "enum": ["Asset", "Liability", "Equity", "Income", "Expense"],
      "description": "Filter by account type"
    },
    "isActive": {
      "type": "boolean",
      "description": "Filter by active status"
    },
    "nameContains": {
      "type": "string",
      "description": "Filter by account name containing text"
    },
    "limit": {
      "type": "number",
      "minimum": 1,
      "maximum": 100
    },
    "cursor": {
      "type": "string"
    }
  }
}
```

**Example Usage:**
```json
{
  "accountType": "Expense",
  "isActive": true,
  "nameContains": "Office",
  "limit": 20
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accounts": [
      {
        "id": "account_123",
        "name": "Office Supplies",
        "accountType": "Expense",
        "accountNumber": "6100",
        "isActive": true,
        "balance": "1250.00",
        "description": "Office supplies and materials"
      }
    ]
  },
  "metadata": {
    "totalCount": 1,
    "hasMore": false
  }
}
```

### get_account

Retrieves detailed information for a specific account.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "accountId": {
      "type": "string",
      "description": "ID of the account to retrieve"
    },
    "includeTransactions": {
      "type": "boolean",
      "description": "Include recent transactions",
      "default": false
    }
  },
  "required": ["accountId"]
}
```

### create_account

Creates a new account in the chart of accounts.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Account name"
    },
    "accountType": {
      "type": "string",
      "enum": ["Asset", "Liability", "Equity", "Income", "Expense"],
      "description": "Type of account"
    },
    "accountNumber": {
      "type": "string",
      "description": "Optional account number"
    },
    "description": {
      "type": "string",
      "description": "Account description"
    },
    "parentAccountId": {
      "type": "string",
      "description": "ID of parent account for sub-accounts"
    }
  },
  "required": ["name", "accountType"]
}
```

### update_account

Updates an existing account's properties.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "accountId": {
      "type": "string",
      "description": "ID of the account to update"
    },
    "name": {
      "type": "string",
      "description": "New account name"
    },
    "description": {
      "type": "string",
      "description": "New account description"
    },
    "isActive": {
      "type": "boolean",
      "description": "Active status"
    },
    "revisionNumber": {
      "type": "string",
      "description": "Current revision number for safe updates"
    }
  },
  "required": ["accountId", "revisionNumber"]
}
```

## Bill Management

### list_bills

Retrieves vendor bills with comprehensive filtering options.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "vendorId": {
      "type": "string",
      "description": "Filter by vendor ID"
    },
    "vendorName": {
      "type": "string",
      "description": "Filter by vendor name"
    },
    "dateFrom": {
      "type": "string",
      "format": "date",
      "description": "Start date for bill date range"
    },
    "dateTo": {
      "type": "string",
      "format": "date",
      "description": "End date for bill date range"
    },
    "dueDateFrom": {
      "type": "string",
      "format": "date",
      "description": "Start date for due date range"
    },
    "dueDateTo": {
      "type": "string",
      "format": "date",
      "description": "End date for due date range"
    },
    "isPaid": {
      "type": "boolean",
      "description": "Filter by payment status"
    },
    "amountFrom": {
      "type": "number",
      "description": "Minimum bill amount"
    },
    "amountTo": {
      "type": "number",
      "description": "Maximum bill amount"
    },
    "limit": {
      "type": "number",
      "minimum": 1,
      "maximum": 100
    },
    "cursor": {
      "type": "string"
    }
  }
}
```

**Example Usage:**
```json
{
  "vendorName": "Office Depot",
  "dateFrom": "2024-01-01",
  "dateTo": "2024-01-31",
  "isPaid": false,
  "limit": 10
}
```

### get_bill

Retrieves detailed information for a specific bill.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "billId": {
      "type": "string",
      "description": "ID of the bill to retrieve"
    },
    "includeLineItems": {
      "type": "boolean",
      "description": "Include detailed line items",
      "default": true
    },
    "includePayments": {
      "type": "boolean",
      "description": "Include payment history",
      "default": false
    }
  },
  "required": ["billId"]
}
```

### create_bill

Creates a new vendor bill with line items.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "vendorId": {
      "type": "string",
      "description": "ID of the vendor"
    },
    "vendorName": {
      "type": "string",
      "description": "Name of the vendor (if vendorId not provided)"
    },
    "referenceNumber": {
      "type": "string",
      "description": "Vendor's invoice/reference number"
    },
    "date": {
      "type": "string",
      "format": "date",
      "description": "Bill date"
    },
    "dueDate": {
      "type": "string",
      "format": "date",
      "description": "Bill due date"
    },
    "memo": {
      "type": "string",
      "description": "Bill memo/notes"
    },
    "lineItems": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "accountId": {
            "type": "string",
            "description": "Expense account ID"
          },
          "description": {
            "type": "string",
            "description": "Line item description"
          },
          "amount": {
            "type": "number",
            "description": "Line item amount"
          },
          "quantity": {
            "type": "number",
            "description": "Quantity (optional)"
          },
          "rate": {
            "type": "number",
            "description": "Rate per unit (optional)"
          }
        },
        "required": ["accountId", "description", "amount"]
      },
      "minItems": 1
    }
  },
  "required": ["date", "lineItems"],
  "oneOf": [
    {"required": ["vendorId"]},
    {"required": ["vendorName"]}
  ]
}
```

**Example Usage:**
```json
{
  "vendorName": "Office Depot",
  "referenceNumber": "INV-2024-001",
  "date": "2024-01-15",
  "dueDate": "2024-02-15",
  "memo": "Office supplies for Q1",
  "lineItems": [
    {
      "accountId": "account_office_supplies",
      "description": "Printer paper and ink",
      "amount": 125.50
    },
    {
      "accountId": "account_office_supplies",
      "description": "Pens and notebooks",
      "amount": 45.75
    }
  ]
}
```

### update_bill

Updates an existing bill's properties.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "billId": {
      "type": "string",
      "description": "ID of the bill to update"
    },
    "referenceNumber": {
      "type": "string",
      "description": "Updated reference number"
    },
    "dueDate": {
      "type": "string",
      "format": "date",
      "description": "Updated due date"
    },
    "memo": {
      "type": "string",
      "description": "Updated memo"
    },
    "revisionNumber": {
      "type": "string",
      "description": "Current revision number for safe updates"
    }
  },
  "required": ["billId", "revisionNumber"]
}
```

## Payment Processing

### list_bill_check_payments

Retrieves check payments made for bills.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "billId": {
      "type": "string",
      "description": "Filter by specific bill ID"
    },
    "vendorId": {
      "type": "string",
      "description": "Filter by vendor ID"
    },
    "accountId": {
      "type": "string",
      "description": "Filter by bank account ID"
    },
    "dateFrom": {
      "type": "string",
      "format": "date",
      "description": "Start date for payment date range"
    },
    "dateTo": {
      "type": "string",
      "format": "date",
      "description": "End date for payment date range"
    },
    "amountFrom": {
      "type": "number",
      "description": "Minimum payment amount"
    },
    "amountTo": {
      "type": "number",
      "description": "Maximum payment amount"
    },
    "limit": {
      "type": "number",
      "minimum": 1,
      "maximum": 100
    },
    "cursor": {
      "type": "string"
    }
  }
}
```

### list_bill_credit_card_payments

Retrieves credit card payments made for bills.

**Input Schema:** Same as `list_bill_check_payments`

### create_bill_check_payment

Processes a check payment for one or more bills.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "bankAccountId": {
      "type": "string",
      "description": "ID of the bank account to pay from"
    },
    "paymentDate": {
      "type": "string",
      "format": "date",
      "description": "Date of payment"
    },
    "checkNumber": {
      "type": "string",
      "description": "Check number (optional)"
    },
    "memo": {
      "type": "string",
      "description": "Payment memo"
    },
    "billPayments": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "billId": {
            "type": "string",
            "description": "ID of the bill to pay"
          },
          "amount": {
            "type": "number",
            "description": "Amount to pay (partial payments allowed)"
          }
        },
        "required": ["billId", "amount"]
      },
      "minItems": 1
    }
  },
  "required": ["bankAccountId", "paymentDate", "billPayments"]
}
```

**Example Usage:**
```json
{
  "bankAccountId": "account_checking_main",
  "paymentDate": "2024-01-20",
  "checkNumber": "1001",
  "memo": "Payment for office supplies",
  "billPayments": [
    {
      "billId": "bill_123",
      "amount": 171.25
    }
  ]
}
```

### create_bill_credit_card_payment

Processes a credit card payment for one or more bills.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "creditCardAccountId": {
      "type": "string",
      "description": "ID of the credit card account"
    },
    "paymentDate": {
      "type": "string",
      "format": "date",
      "description": "Date of payment"
    },
    "referenceNumber": {
      "type": "string",
      "description": "Transaction reference number"
    },
    "memo": {
      "type": "string",
      "description": "Payment memo"
    },
    "billPayments": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "billId": {
            "type": "string",
            "description": "ID of the bill to pay"
          },
          "amount": {
            "type": "number",
            "description": "Amount to pay"
          }
        },
        "required": ["billId", "amount"]
      },
      "minItems": 1
    }
  },
  "required": ["creditCardAccountId", "paymentDate", "billPayments"]
}
```

### update_payment

Updates an existing payment's properties.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "paymentId": {
      "type": "string",
      "description": "ID of the payment to update"
    },
    "memo": {
      "type": "string",
      "description": "Updated memo"
    },
    "referenceNumber": {
      "type": "string",
      "description": "Updated reference number"
    },
    "revisionNumber": {
      "type": "string",
      "description": "Current revision number for safe updates"
    }
  },
  "required": ["paymentId", "revisionNumber"]
}
```

### delete_payment

Removes a payment transaction.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "paymentId": {
      "type": "string",
      "description": "ID of the payment to delete"
    },
    "revisionNumber": {
      "type": "string",
      "description": "Current revision number for safe deletion"
    }
  },
  "required": ["paymentId", "revisionNumber"]
}
```

## Reporting & Analysis

### get_account_tax_lines

Retrieves tax line information for accounts.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "accountId": {
      "type": "string",
      "description": "Specific account ID (optional)"
    },
    "taxYear": {
      "type": "number",
      "description": "Tax year to retrieve",
      "minimum": 2020,
      "maximum": 2030
    },
    "includeInactive": {
      "type": "boolean",
      "description": "Include inactive accounts",
      "default": false
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "taxLines": [
      {
        "accountId": "account_123",
        "accountName": "Office Supplies",
        "taxLineId": "tax_line_456",
        "taxLineName": "Business Expenses",
        "amount": "1250.00",
        "taxYear": 2024
      }
    ]
  }
}
```

### generate_financial_summary

Generates aggregated financial data across accounts.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "dateFrom": {
      "type": "string",
      "format": "date",
      "description": "Start date for summary period"
    },
    "dateTo": {
      "type": "string",
      "format": "date",
      "description": "End date for summary period"
    },
    "accountTypes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["Asset", "Liability", "Equity", "Income", "Expense"]
      },
      "description": "Account types to include"
    },
    "groupBy": {
      "type": "string",
      "enum": ["accountType", "month", "quarter"],
      "description": "How to group the summary data",
      "default": "accountType"
    },
    "includeSubAccounts": {
      "type": "boolean",
      "description": "Include sub-account details",
      "default": true
    }
  },
  "required": ["dateFrom", "dateTo"]
}
```

**Example Usage:**
```json
{
  "dateFrom": "2024-01-01",
  "dateTo": "2024-03-31",
  "accountTypes": ["Expense"],
  "groupBy": "month"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalExpenses": "15750.00",
      "period": "Q1 2024",
      "accountCount": 12
    },
    "breakdown": [
      {
        "month": "January 2024",
        "totalAmount": "5250.00",
        "accountBreakdown": [
          {
            "accountName": "Office Supplies",
            "amount": "1250.00"
          }
        ]
      }
    ]
  }
}
```

### get_vendor_spending_analysis

Analyzes spending patterns by vendor over a specified period.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "dateFrom": {
      "type": "string",
      "format": "date",
      "description": "Start date for analysis period"
    },
    "dateTo": {
      "type": "string",
      "format": "date",
      "description": "End date for analysis period"
    },
    "vendorId": {
      "type": "string",
      "description": "Specific vendor ID (optional)"
    },
    "minAmount": {
      "type": "number",
      "description": "Minimum spending threshold",
      "default": 0
    },
    "sortBy": {
      "type": "string",
      "enum": ["amount", "frequency", "name"],
      "description": "Sort results by",
      "default": "amount"
    },
    "sortOrder": {
      "type": "string",
      "enum": ["asc", "desc"],
      "description": "Sort order",
      "default": "desc"
    },
    "limit": {
      "type": "number",
      "minimum": 1,
      "maximum": 100,
      "description": "Maximum number of vendors to return"
    }
  },
  "required": ["dateFrom", "dateTo"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "totalSpending": "25750.00",
      "vendorCount": 15,
      "period": "2024-01-01 to 2024-06-30",
      "averagePerVendor": "1716.67"
    },
    "vendors": [
      {
        "vendorId": "vendor_123",
        "vendorName": "Office Depot",
        "totalAmount": "3250.00",
        "billCount": 8,
        "averageAmount": "406.25",
        "lastBillDate": "2024-06-15"
      }
    ]
  }
}
```

## Advanced Operations

### passthrough_request

Enables direct API calls to the Conductor API for custom operations.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "method": {
      "type": "string",
      "enum": ["GET", "POST", "PUT", "PATCH", "DELETE"],
      "description": "HTTP method"
    },
    "endpoint": {
      "type": "string",
      "description": "API endpoint path (without base URL)"
    },
    "headers": {
      "type": "object",
      "description": "Additional headers to include"
    },
    "body": {
      "type": "object",
      "description": "Request body for POST/PUT/PATCH requests"
    },
    "queryParams": {
      "type": "object",
      "description": "Query parameters to include"
    }
  },
  "required": ["method", "endpoint"]
}
```

**Example Usage:**
```json
{
  "method": "GET",
  "endpoint": "/quickbooks-desktop/vendors",
  "queryParams": {
    "limit": 50,
    "isActive": true
  }
}
```

**Security Note:** This tool provides direct API access and should be used carefully. Input validation and error handling are still applied.

### bulk_operations

Enables batch processing of multiple operations for efficiency.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "operations": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "operation": {
            "type": "string",
            "description": "Name of the operation to perform"
          },
          "parameters": {
            "type": "object",
            "description": "Parameters for the operation"
          },
          "id": {
            "type": "string",
            "description": "Unique identifier for this operation in the batch"
          }
        },
        "required": ["operation", "parameters", "id"]
      },
      "minItems": 1,
      "maxItems": 50
    },
    "continueOnError": {
      "type": "boolean",
      "description": "Continue processing if individual operations fail",
      "default": true
    }
  },
  "required": ["operations"]
}
```

**Example Usage:**
```json
{
  "operations": [
    {
      "id": "create_bill_1",
      "operation": "create_bill",
      "parameters": {
        "vendorName": "Office Depot",
        "date": "2024-01-15",
        "lineItems": [
          {
            "accountId": "account_office_supplies",
            "description": "Printer paper",
            "amount": 50.00
          }
        ]
      }
    },
    {
      "id": "create_bill_2",
      "operation": "create_bill",
      "parameters": {
        "vendorName": "Staples",
        "date": "2024-01-16",
        "lineItems": [
          {
            "accountId": "account_office_supplies",
            "description": "Pens and pencils",
            "amount": 25.00
          }
        ]
      }
    }
  ],
  "continueOnError": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "create_bill_1",
        "success": true,
        "data": {
          "billId": "bill_123",
          "status": "created"
        }
      },
      {
        "id": "create_bill_2",
        "success": false,
        "error": {
          "message": "Vendor not found",
          "code": "VENDOR_NOT_FOUND"
        }
      }
    ],
    "summary": {
      "total": 2,
      "successful": 1,
      "failed": 1
    }
  }
}
```

## Rate Limiting

The server implements rate limiting to protect against excessive API usage:

- **Default Limit**: 100 requests per minute per end-user
- **Burst Limit**: 20 requests per 10-second window
- **Rate Limit Headers**: Included in all responses

When rate limits are exceeded, the server returns a `429 Too Many Requests` status with retry information.

## Caching

The server implements intelligent caching to optimize performance:

- **Cache TTL**: Configurable (default: 30 minutes)
- **Cache Size**: Configurable (default: 1000 items)
- **Cache Invalidation**: Automatic on data modifications
- **Cache Statistics**: Available through logging

## Security Considerations

- **Input Validation**: All inputs are validated using Zod schemas
- **API Key Security**: Keys are never logged or exposed in responses
- **Multi-Tenant Isolation**: Proper end-user context management
- **Error Sanitization**: Sensitive data is never exposed in error messages
- **Audit Logging**: All financial operations are logged for compliance

## Support

For additional support:

1. Check the [Setup Guide](SETUP.md) for configuration issues
2. Review the [Troubleshooting Guide](TROUBLESHOOTING.md) for common problems
3. Consult the [Conductor API Documentation](https://docs.conductor.is/api-ref/welcome)
4. Create an issue in the GitHub repository for bugs or feature requests

---

*This API reference is automatically generated from the MCP server implementation. For the most up-to-date information, refer to the source code and tool definitions.*
