import { QuickBooksDesktopMCPServer } from '../server';
import { tools } from '../tools/index';

describe('QuickBooksDesktopMCPServer', () => {
  let server: QuickBooksDesktopMCPServer;

  beforeEach(() => {
    server = new QuickBooksDesktopMCPServer();
  });

  afterEach(async () => {
    if (server) {
      await server.stop();
    }
  });

  test('should initialize with correct tool count', () => {
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.length).toBe(22); // Expected number of tools
  });

  test('should have all required tools', () => {
    const toolNames = tools.map(tool => tool.name);
    
    expect(toolNames).toContain('create_end_user');
    expect(toolNames).toContain('list_end_users');
    expect(toolNames).toContain('get_end_user');
    expect(toolNames).toContain('delete_end_user');
    
    expect(toolNames).toContain('create_auth_session');
    expect(toolNames).toContain('check_connection_status');
    
    expect(toolNames).toContain('list_accounts');
    expect(toolNames).toContain('get_account');
    expect(toolNames).toContain('create_account');
    expect(toolNames).toContain('update_account');
    
    expect(toolNames).toContain('list_bills');
    expect(toolNames).toContain('get_bill');
    expect(toolNames).toContain('create_bill');
    expect(toolNames).toContain('update_bill');
    
    expect(toolNames).toContain('list_bill_check_payments');
    expect(toolNames).toContain('list_bill_credit_card_payments');
    expect(toolNames).toContain('create_bill_check_payment');
    expect(toolNames).toContain('create_bill_credit_card_payment');
    expect(toolNames).toContain('update_payment');
    expect(toolNames).toContain('delete_payment');
    
    expect(toolNames).toContain('get_account_tax_lines');
    expect(toolNames).toContain('generate_financial_summary');
    expect(toolNames).toContain('get_vendor_spending_analysis');
    
    expect(toolNames).toContain('passthrough_request');
    expect(toolNames).toContain('bulk_operations');
  });

  test('should have proper tool schemas', () => {
    tools.forEach(tool => {
      expect(tool.name).toBeDefined();
      expect(tool.description).toBeDefined();
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
    });
  });
});
