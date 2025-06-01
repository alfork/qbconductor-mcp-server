export interface EndUser {
  id: string;
  sourceId?: string;
  email?: string;
  companyName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  id: string;
  url: string;
  expiresAt: string;
}

export interface Account {
  id: string;
  objectType: 'qbd_account';
  createdAt: string;
  updatedAt: string;
  revisionNumber: string;
  name: string;
  fullName: string;
  isActive: boolean;
  parent?: {
    id: string;
    fullName: string;
  };
  sublevel: number;
  accountType: string;
  specialAccountType?: string;
  isTaxAccount: boolean;
  accountNumber?: string;
  bankAccountNumber?: string;
  description?: string;
  balance: string;
  totalBalance: string;
  salesTaxCode?: {
    id: string;
    fullName: string;
  };
  taxLineDetails?: {
    taxLineId: number;
    taxLineName: string;
  };
  cashFlowClassification?: string;
  currency?: {
    id: string;
    fullName: string;
  };
  customFields?: Array<{
    name: string;
    value: string;
  }>;
}

export interface Bill {
  id: string;
  objectType: 'qbd_bill';
  createdAt: string;
  updatedAt: string;
  revisionNumber: string;
  refNumber?: string;
  vendor: {
    id: string;
    fullName: string;
  };
  transactionDate: string;
  dueDate?: string;
  terms?: {
    id: string;
    fullName: string;
  };
  memo?: string;
  isPaid: boolean;
  openBalance: string;
  subtotal: string;
  totalAmount: string;
  currency?: {
    id: string;
    fullName: string;
  };
  exchangeRate?: number;
  lines: BillLine[];
  customFields?: Array<{
    name: string;
    value: string;
  }>;
}

export interface BillLine {
  id?: string;
  description?: string;
  quantity?: number;
  rate?: string;
  amount: string;
  account?: {
    id: string;
    fullName: string;
  };
  item?: {
    id: string;
    fullName: string;
  };
  class?: {
    id: string;
    fullName: string;
  };
  customer?: {
    id: string;
    fullName: string;
  };
  billableStatus?: string;
}

export interface BillPayment {
  id: string;
  objectType: 'qbd_bill_check_payment' | 'qbd_bill_credit_card_payment';
  createdAt: string;
  updatedAt: string;
  revisionNumber: string;
  refNumber?: string;
  transactionDate: string;
  payee: {
    id: string;
    fullName: string;
  };
  account: {
    id: string;
    fullName: string;
  };
  totalAmount: string;
  memo?: string;
  currency?: {
    id: string;
    fullName: string;
  };
  exchangeRate?: number;
  appliedToBills: Array<{
    bill: {
      id: string;
      refNumber?: string;
    };
    appliedAmount: string;
  }>;
}

export interface Vendor {
  id: string;
  objectType: 'qbd_vendor';
  createdAt: string;
  updatedAt: string;
  revisionNumber: string;
  name: string;
  fullName: string;
  isActive: boolean;
  companyName?: string;
  email?: string;
  phone?: string;
  balance: string;
  customFields?: Array<{
    name: string;
    value: string;
  }>;
}

export interface CreateEndUserRequest {
  sourceId?: string;
  email?: string;
  companyName?: string;
}

export interface CreateAuthSessionRequest {
  publishableKey: string;
  endUserId: string;
  redirectUrl?: string;
}

export interface CreateAccountRequest {
  name: string;
  accountType: string;
  description?: string;
  accountNumber?: string;
  parentId?: string;
  isActive?: boolean;
}

export interface UpdateAccountRequest {
  revisionNumber: string;
  name?: string;
  description?: string;
  accountNumber?: string;
  isActive?: boolean;
}

export interface CreateBillRequest {
  vendorId: string;
  transactionDate: string;
  dueDate?: string;
  refNumber?: string;
  memo?: string;
  lines: Array<{
    description?: string;
    quantity?: number;
    rate?: string;
    amount: string;
    accountId?: string;
    itemId?: string;
    classId?: string;
    customerId?: string;
  }>;
}

export interface UpdateBillRequest {
  revisionNumber: string;
  vendorId?: string;
  transactionDate?: string;
  dueDate?: string;
  refNumber?: string;
  memo?: string;
  lines?: Array<{
    id?: string;
    description?: string;
    quantity?: number;
    rate?: string;
    amount?: string;
    accountId?: string;
    itemId?: string;
    classId?: string;
    customerId?: string;
  }>;
}

export interface CreateBillPaymentRequest {
  payeeId: string;
  accountId: string;
  transactionDate: string;
  refNumber?: string;
  memo?: string;
  appliedToBills: Array<{
    billId: string;
    appliedAmount: string;
  }>;
}
