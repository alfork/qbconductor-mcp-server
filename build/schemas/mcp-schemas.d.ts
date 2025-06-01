import { z } from 'zod';
export declare const EndUserIdSchema: z.ZodOptional<z.ZodString>;
export declare const PaginationSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    cursor?: string | undefined;
}, {
    cursor?: string | undefined;
    limit?: number | undefined;
}>;
export declare const DateRangeSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
export declare const CreateEndUserSchema: z.ZodObject<{
    sourceId: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    companyName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sourceId?: string | undefined;
    email?: string | undefined;
    companyName?: string | undefined;
}, {
    sourceId?: string | undefined;
    email?: string | undefined;
    companyName?: string | undefined;
}>;
export declare const CreateAuthSessionSchema: z.ZodObject<{
    endUserId: z.ZodString;
    redirectUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    endUserId: string;
    redirectUrl?: string | undefined;
}, {
    endUserId: string;
    redirectUrl?: string | undefined;
}>;
export declare const ListAccountsSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    accountType: z.ZodOptional<z.ZodEnum<["bank", "accounts_payable", "accounts_receivable", "other_current_asset", "fixed_asset", "other_asset", "credit_card", "other_current_liability", "long_term_liability", "equity", "income", "cost_of_goods_sold", "expense", "other_income", "other_expense"]>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    nameContains: z.ZodOptional<z.ZodString>;
    includeInactive: z.ZodDefault<z.ZodBoolean>;
} & {
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    includeInactive: boolean;
    cursor?: string | undefined;
    endUserId?: string | undefined;
    accountType?: "bank" | "accounts_payable" | "accounts_receivable" | "other_current_asset" | "fixed_asset" | "other_asset" | "credit_card" | "other_current_liability" | "long_term_liability" | "equity" | "income" | "cost_of_goods_sold" | "expense" | "other_income" | "other_expense" | undefined;
    isActive?: boolean | undefined;
    nameContains?: string | undefined;
}, {
    cursor?: string | undefined;
    endUserId?: string | undefined;
    limit?: number | undefined;
    accountType?: "bank" | "accounts_payable" | "accounts_receivable" | "other_current_asset" | "fixed_asset" | "other_asset" | "credit_card" | "other_current_liability" | "long_term_liability" | "equity" | "income" | "cost_of_goods_sold" | "expense" | "other_income" | "other_expense" | undefined;
    isActive?: boolean | undefined;
    nameContains?: string | undefined;
    includeInactive?: boolean | undefined;
}>;
export declare const GetAccountSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    accountId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    accountId: string;
    endUserId?: string | undefined;
}, {
    accountId: string;
    endUserId?: string | undefined;
}>;
export declare const CreateAccountSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    accountType: z.ZodEnum<["bank", "accounts_payable", "accounts_receivable", "other_current_asset", "fixed_asset", "other_asset", "credit_card", "other_current_liability", "long_term_liability", "equity", "income", "cost_of_goods_sold", "expense", "other_income", "other_expense"]>;
    description: z.ZodOptional<z.ZodString>;
    accountNumber: z.ZodOptional<z.ZodString>;
    parentId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    accountType: "bank" | "accounts_payable" | "accounts_receivable" | "other_current_asset" | "fixed_asset" | "other_asset" | "credit_card" | "other_current_liability" | "long_term_liability" | "equity" | "income" | "cost_of_goods_sold" | "expense" | "other_income" | "other_expense";
    isActive: boolean;
    name: string;
    endUserId?: string | undefined;
    description?: string | undefined;
    accountNumber?: string | undefined;
    parentId?: string | undefined;
}, {
    accountType: "bank" | "accounts_payable" | "accounts_receivable" | "other_current_asset" | "fixed_asset" | "other_asset" | "credit_card" | "other_current_liability" | "long_term_liability" | "equity" | "income" | "cost_of_goods_sold" | "expense" | "other_income" | "other_expense";
    name: string;
    endUserId?: string | undefined;
    isActive?: boolean | undefined;
    description?: string | undefined;
    accountNumber?: string | undefined;
    parentId?: string | undefined;
}>;
export declare const UpdateAccountSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    accountId: z.ZodString;
    revisionNumber: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    accountNumber: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    accountId: string;
    revisionNumber: string;
    endUserId?: string | undefined;
    isActive?: boolean | undefined;
    name?: string | undefined;
    description?: string | undefined;
    accountNumber?: string | undefined;
}, {
    accountId: string;
    revisionNumber: string;
    endUserId?: string | undefined;
    isActive?: boolean | undefined;
    name?: string | undefined;
    description?: string | undefined;
    accountNumber?: string | undefined;
}>;
export declare const ListBillsSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    vendorId: z.ZodOptional<z.ZodString>;
    vendorName: z.ZodOptional<z.ZodString>;
    isPaid: z.ZodOptional<z.ZodBoolean>;
    refNumber: z.ZodOptional<z.ZodString>;
    memo: z.ZodOptional<z.ZodString>;
} & {
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
} & {
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    cursor?: string | undefined;
    endUserId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    vendorId?: string | undefined;
    vendorName?: string | undefined;
    isPaid?: boolean | undefined;
    refNumber?: string | undefined;
    memo?: string | undefined;
}, {
    cursor?: string | undefined;
    endUserId?: string | undefined;
    limit?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    vendorId?: string | undefined;
    vendorName?: string | undefined;
    isPaid?: boolean | undefined;
    refNumber?: string | undefined;
    memo?: string | undefined;
}>;
export declare const GetBillSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    billId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    billId: string;
    endUserId?: string | undefined;
}, {
    billId: string;
    endUserId?: string | undefined;
}>;
export declare const BillLineSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    quantity: z.ZodOptional<z.ZodNumber>;
    rate: z.ZodOptional<z.ZodString>;
    amount: z.ZodString;
    accountId: z.ZodOptional<z.ZodString>;
    itemId: z.ZodOptional<z.ZodString>;
    classId: z.ZodOptional<z.ZodString>;
    customerId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: string;
    accountId?: string | undefined;
    description?: string | undefined;
    quantity?: number | undefined;
    rate?: string | undefined;
    itemId?: string | undefined;
    classId?: string | undefined;
    customerId?: string | undefined;
}, {
    amount: string;
    accountId?: string | undefined;
    description?: string | undefined;
    quantity?: number | undefined;
    rate?: string | undefined;
    itemId?: string | undefined;
    classId?: string | undefined;
    customerId?: string | undefined;
}>;
export declare const CreateBillSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    vendorId: z.ZodString;
    transactionDate: z.ZodString;
    dueDate: z.ZodOptional<z.ZodString>;
    refNumber: z.ZodOptional<z.ZodString>;
    memo: z.ZodOptional<z.ZodString>;
    lines: z.ZodArray<z.ZodObject<{
        description: z.ZodOptional<z.ZodString>;
        quantity: z.ZodOptional<z.ZodNumber>;
        rate: z.ZodOptional<z.ZodString>;
        amount: z.ZodString;
        accountId: z.ZodOptional<z.ZodString>;
        itemId: z.ZodOptional<z.ZodString>;
        classId: z.ZodOptional<z.ZodString>;
        customerId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        amount: string;
        accountId?: string | undefined;
        description?: string | undefined;
        quantity?: number | undefined;
        rate?: string | undefined;
        itemId?: string | undefined;
        classId?: string | undefined;
        customerId?: string | undefined;
    }, {
        amount: string;
        accountId?: string | undefined;
        description?: string | undefined;
        quantity?: number | undefined;
        rate?: string | undefined;
        itemId?: string | undefined;
        classId?: string | undefined;
        customerId?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    vendorId: string;
    transactionDate: string;
    lines: {
        amount: string;
        accountId?: string | undefined;
        description?: string | undefined;
        quantity?: number | undefined;
        rate?: string | undefined;
        itemId?: string | undefined;
        classId?: string | undefined;
        customerId?: string | undefined;
    }[];
    endUserId?: string | undefined;
    refNumber?: string | undefined;
    memo?: string | undefined;
    dueDate?: string | undefined;
}, {
    vendorId: string;
    transactionDate: string;
    lines: {
        amount: string;
        accountId?: string | undefined;
        description?: string | undefined;
        quantity?: number | undefined;
        rate?: string | undefined;
        itemId?: string | undefined;
        classId?: string | undefined;
        customerId?: string | undefined;
    }[];
    endUserId?: string | undefined;
    refNumber?: string | undefined;
    memo?: string | undefined;
    dueDate?: string | undefined;
}>;
export declare const UpdateBillSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    billId: z.ZodString;
    revisionNumber: z.ZodString;
    vendorId: z.ZodOptional<z.ZodString>;
    transactionDate: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodString>;
    refNumber: z.ZodOptional<z.ZodString>;
    memo: z.ZodOptional<z.ZodString>;
    lines: z.ZodOptional<z.ZodArray<z.ZodObject<{
        description: z.ZodOptional<z.ZodString>;
        quantity: z.ZodOptional<z.ZodNumber>;
        rate: z.ZodOptional<z.ZodString>;
        amount: z.ZodString;
        accountId: z.ZodOptional<z.ZodString>;
        itemId: z.ZodOptional<z.ZodString>;
        classId: z.ZodOptional<z.ZodString>;
        customerId: z.ZodOptional<z.ZodString>;
    } & {
        id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        amount: string;
        accountId?: string | undefined;
        description?: string | undefined;
        quantity?: number | undefined;
        rate?: string | undefined;
        itemId?: string | undefined;
        classId?: string | undefined;
        customerId?: string | undefined;
        id?: string | undefined;
    }, {
        amount: string;
        accountId?: string | undefined;
        description?: string | undefined;
        quantity?: number | undefined;
        rate?: string | undefined;
        itemId?: string | undefined;
        classId?: string | undefined;
        customerId?: string | undefined;
        id?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    revisionNumber: string;
    billId: string;
    endUserId?: string | undefined;
    vendorId?: string | undefined;
    refNumber?: string | undefined;
    memo?: string | undefined;
    transactionDate?: string | undefined;
    dueDate?: string | undefined;
    lines?: {
        amount: string;
        accountId?: string | undefined;
        description?: string | undefined;
        quantity?: number | undefined;
        rate?: string | undefined;
        itemId?: string | undefined;
        classId?: string | undefined;
        customerId?: string | undefined;
        id?: string | undefined;
    }[] | undefined;
}, {
    revisionNumber: string;
    billId: string;
    endUserId?: string | undefined;
    vendorId?: string | undefined;
    refNumber?: string | undefined;
    memo?: string | undefined;
    transactionDate?: string | undefined;
    dueDate?: string | undefined;
    lines?: {
        amount: string;
        accountId?: string | undefined;
        description?: string | undefined;
        quantity?: number | undefined;
        rate?: string | undefined;
        itemId?: string | undefined;
        classId?: string | undefined;
        customerId?: string | undefined;
        id?: string | undefined;
    }[] | undefined;
}>;
export declare const ListBillPaymentsSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    paymentType: z.ZodOptional<z.ZodEnum<["check", "credit_card"]>>;
    payeeId: z.ZodOptional<z.ZodString>;
    accountId: z.ZodOptional<z.ZodString>;
    refNumber: z.ZodOptional<z.ZodString>;
} & {
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
} & {
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    cursor?: string | undefined;
    endUserId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    accountId?: string | undefined;
    refNumber?: string | undefined;
    paymentType?: "credit_card" | "check" | undefined;
    payeeId?: string | undefined;
}, {
    cursor?: string | undefined;
    endUserId?: string | undefined;
    limit?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    accountId?: string | undefined;
    refNumber?: string | undefined;
    paymentType?: "credit_card" | "check" | undefined;
    payeeId?: string | undefined;
}>;
export declare const GetBillPaymentSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    paymentId: z.ZodString;
    paymentType: z.ZodEnum<["check", "credit_card"]>;
}, "strip", z.ZodTypeAny, {
    paymentType: "credit_card" | "check";
    paymentId: string;
    endUserId?: string | undefined;
}, {
    paymentType: "credit_card" | "check";
    paymentId: string;
    endUserId?: string | undefined;
}>;
export declare const AppliedBillSchema: z.ZodObject<{
    billId: z.ZodString;
    appliedAmount: z.ZodString;
}, "strip", z.ZodTypeAny, {
    billId: string;
    appliedAmount: string;
}, {
    billId: string;
    appliedAmount: string;
}>;
export declare const CreateBillPaymentSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    paymentType: z.ZodEnum<["check", "credit_card"]>;
    payeeId: z.ZodString;
    accountId: z.ZodString;
    transactionDate: z.ZodString;
    refNumber: z.ZodOptional<z.ZodString>;
    memo: z.ZodOptional<z.ZodString>;
    appliedToBills: z.ZodArray<z.ZodObject<{
        billId: z.ZodString;
        appliedAmount: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        billId: string;
        appliedAmount: string;
    }, {
        billId: string;
        appliedAmount: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    accountId: string;
    transactionDate: string;
    paymentType: "credit_card" | "check";
    payeeId: string;
    appliedToBills: {
        billId: string;
        appliedAmount: string;
    }[];
    endUserId?: string | undefined;
    refNumber?: string | undefined;
    memo?: string | undefined;
}, {
    accountId: string;
    transactionDate: string;
    paymentType: "credit_card" | "check";
    payeeId: string;
    appliedToBills: {
        billId: string;
        appliedAmount: string;
    }[];
    endUserId?: string | undefined;
    refNumber?: string | undefined;
    memo?: string | undefined;
}>;
export declare const UpdateBillPaymentSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    paymentId: z.ZodString;
    paymentType: z.ZodEnum<["check", "credit_card"]>;
    revisionNumber: z.ZodString;
    refNumber: z.ZodOptional<z.ZodString>;
    memo: z.ZodOptional<z.ZodString>;
    appliedToBills: z.ZodOptional<z.ZodArray<z.ZodObject<{
        billId: z.ZodString;
        appliedAmount: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        billId: string;
        appliedAmount: string;
    }, {
        billId: string;
        appliedAmount: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    revisionNumber: string;
    paymentType: "credit_card" | "check";
    paymentId: string;
    endUserId?: string | undefined;
    refNumber?: string | undefined;
    memo?: string | undefined;
    appliedToBills?: {
        billId: string;
        appliedAmount: string;
    }[] | undefined;
}, {
    revisionNumber: string;
    paymentType: "credit_card" | "check";
    paymentId: string;
    endUserId?: string | undefined;
    refNumber?: string | undefined;
    memo?: string | undefined;
    appliedToBills?: {
        billId: string;
        appliedAmount: string;
    }[] | undefined;
}>;
export declare const DeleteBillPaymentSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    paymentId: z.ZodString;
    paymentType: z.ZodEnum<["check", "credit_card"]>;
}, "strip", z.ZodTypeAny, {
    paymentType: "credit_card" | "check";
    paymentId: string;
    endUserId?: string | undefined;
}, {
    paymentType: "credit_card" | "check";
    paymentId: string;
    endUserId?: string | undefined;
}>;
export declare const GetAccountTaxLinesSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    accountId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    endUserId?: string | undefined;
    accountId?: string | undefined;
}, {
    endUserId?: string | undefined;
    accountId?: string | undefined;
}>;
export declare const GenerateFinancialSummarySchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    accountTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<["bank", "accounts_payable", "accounts_receivable", "other_current_asset", "fixed_asset", "other_asset", "credit_card", "other_current_liability", "long_term_liability", "equity", "income", "cost_of_goods_sold", "expense", "other_income", "other_expense"]>, "many">>;
    includeInactive: z.ZodDefault<z.ZodBoolean>;
} & {
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    includeInactive: boolean;
    endUserId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    accountTypes?: ("bank" | "accounts_payable" | "accounts_receivable" | "other_current_asset" | "fixed_asset" | "other_asset" | "credit_card" | "other_current_liability" | "long_term_liability" | "equity" | "income" | "cost_of_goods_sold" | "expense" | "other_income" | "other_expense")[] | undefined;
}, {
    endUserId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    includeInactive?: boolean | undefined;
    accountTypes?: ("bank" | "accounts_payable" | "accounts_receivable" | "other_current_asset" | "fixed_asset" | "other_asset" | "credit_card" | "other_current_liability" | "long_term_liability" | "equity" | "income" | "cost_of_goods_sold" | "expense" | "other_income" | "other_expense")[] | undefined;
}>;
export declare const GetVendorSpendingAnalysisSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    vendorId: z.ZodOptional<z.ZodString>;
    includePayments: z.ZodDefault<z.ZodBoolean>;
} & {
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    includePayments: boolean;
    endUserId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    vendorId?: string | undefined;
}, {
    endUserId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    vendorId?: string | undefined;
    includePayments?: boolean | undefined;
}>;
export declare const PassthroughRequestSchema: z.ZodObject<{
    endUserId: z.ZodString;
    method: z.ZodEnum<["GET", "POST", "PUT", "DELETE"]>;
    endpoint: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    method: "GET" | "DELETE" | "POST" | "PUT";
    endUserId: string;
    endpoint: string;
    params?: Record<string, string> | undefined;
    data?: Record<string, any> | undefined;
}, {
    method: "GET" | "DELETE" | "POST" | "PUT";
    endUserId: string;
    endpoint: string;
    params?: Record<string, string> | undefined;
    data?: Record<string, any> | undefined;
}>;
export declare const BulkOperationSchema: z.ZodObject<{
    endUserId: z.ZodOptional<z.ZodString>;
    operations: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["create_bill", "update_bill", "create_payment", "update_payment"]>;
        data: z.ZodRecord<z.ZodString, z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        data: Record<string, any>;
        type: "create_bill" | "update_bill" | "create_payment" | "update_payment";
    }, {
        data: Record<string, any>;
        type: "create_bill" | "update_bill" | "create_payment" | "update_payment";
    }>, "many">;
    continueOnError: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    operations: {
        data: Record<string, any>;
        type: "create_bill" | "update_bill" | "create_payment" | "update_payment";
    }[];
    continueOnError: boolean;
    endUserId?: string | undefined;
}, {
    operations: {
        data: Record<string, any>;
        type: "create_bill" | "update_bill" | "create_payment" | "update_payment";
    }[];
    endUserId?: string | undefined;
    continueOnError?: boolean | undefined;
}>;
//# sourceMappingURL=mcp-schemas.d.ts.map