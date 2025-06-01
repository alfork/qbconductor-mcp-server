import { Tool } from '@modelcontextprotocol/sdk/types.js';

import {
  createEndUserTool,
  listEndUsersTool,
  getEndUserTool,
  deleteEndUserTool,
  createEndUserHandler,
  listEndUsersHandler,
  getEndUserHandler,
  deleteEndUserHandler,
} from './end-users.js';

import {
  createAuthSessionTool,
  checkConnectionStatusTool,
  createAuthSessionHandler,
  checkConnectionStatusHandler,
} from './auth.js';

import {
  listAccountsTool,
  getAccountTool,
  createAccountTool,
  updateAccountTool,
  listAccountsHandler,
  getAccountHandler,
  createAccountHandler,
  updateAccountHandler,
} from './accounts.js';

import {
  listBillsTool,
  getBillTool,
  createBillTool,
  updateBillTool,
  listBillsHandler,
  getBillHandler,
  createBillHandler,
  updateBillHandler,
} from './bills.js';

import {
  listBillCheckPaymentsTool,
  listBillCreditCardPaymentsTool,
  createBillCheckPaymentTool,
  createBillCreditCardPaymentTool,
  updatePaymentTool,
  deletePaymentTool,
  listBillCheckPaymentsHandler,
  listBillCreditCardPaymentsHandler,
  createBillCheckPaymentHandler,
  createBillCreditCardPaymentHandler,
  updatePaymentHandler,
  deletePaymentHandler,
} from './payments.js';

import {
  getAccountTaxLinesTool,
  generateFinancialSummaryTool,
  getVendorSpendingAnalysisTool,
  getAccountTaxLinesHandler,
  generateFinancialSummaryHandler,
  getVendorSpendingAnalysisHandler,
} from './reporting.js';

import {
  passthroughRequestTool,
  bulkOperationsTool,
  passthroughRequestHandler,
  bulkOperationsHandler,
} from './advanced.js';

export const tools: Tool[] = [
  createEndUserTool,
  listEndUsersTool,
  getEndUserTool,
  deleteEndUserTool,
  
  createAuthSessionTool,
  checkConnectionStatusTool,
  
  listAccountsTool,
  getAccountTool,
  createAccountTool,
  updateAccountTool,
  
  listBillsTool,
  getBillTool,
  createBillTool,
  updateBillTool,
  
  listBillCheckPaymentsTool,
  listBillCreditCardPaymentsTool,
  createBillCheckPaymentTool,
  createBillCreditCardPaymentTool,
  updatePaymentTool,
  deletePaymentTool,
  
  getAccountTaxLinesTool,
  generateFinancialSummaryTool,
  getVendorSpendingAnalysisTool,
  
  passthroughRequestTool,
  bulkOperationsTool,
];

export const toolHandlers: Record<string, (input: unknown) => Promise<any>> = {
  create_end_user: createEndUserHandler,
  list_end_users: listEndUsersHandler,
  get_end_user: getEndUserHandler,
  delete_end_user: deleteEndUserHandler,
  
  create_auth_session: createAuthSessionHandler,
  check_connection_status: checkConnectionStatusHandler,
  
  list_accounts: listAccountsHandler,
  get_account: getAccountHandler,
  create_account: createAccountHandler,
  update_account: updateAccountHandler,
  
  list_bills: listBillsHandler,
  get_bill: getBillHandler,
  create_bill: createBillHandler,
  update_bill: updateBillHandler,
  
  list_bill_check_payments: listBillCheckPaymentsHandler,
  list_bill_credit_card_payments: listBillCreditCardPaymentsHandler,
  create_bill_check_payment: createBillCheckPaymentHandler,
  create_bill_credit_card_payment: createBillCreditCardPaymentHandler,
  update_payment: updatePaymentHandler,
  delete_payment: deletePaymentHandler,
  
  get_account_tax_lines: getAccountTaxLinesHandler,
  generate_financial_summary: generateFinancialSummaryHandler,
  get_vendor_spending_analysis: getVendorSpendingAnalysisHandler,
  
  passthrough_request: passthroughRequestHandler,
  bulk_operations: bulkOperationsHandler,
};
