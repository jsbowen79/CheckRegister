import { Transaction, TransMedia } from './Transaction.js';
import { CategoryNode } from './Category.js';
export declare enum Type {
    Checking = "Checking",
    Savings = "Savings",
    MoneyMarket = "MoneyMarket",
    Credit = "Credit"
}
export declare enum AccountStatus {
    Open = "Open",
    BankClosed = "Bank Closed",
    CustClosed = "Customer Closed",
    Suspended = "Suspended",
    Frozen = "Frozen"
}
export declare class Account {
    name: string;
    type: Type;
    owner: string;
    accountNumber: number;
    private _balance;
    private _pendingBalance;
    currencyType: string;
    private accountStatus;
    private createdAt;
    private transactions;
    private id;
    private usedId;
    constructor(name: string, type: Type, owner: string, accountNumber: number);
    deposit(amount: number, transMedia: TransMedia, category?: CategoryNode | undefined, transMemo?: string): {
        success: Boolean;
        message: string;
    };
    withdraw(amount: number, transMedia: TransMedia, category?: CategoryNode | undefined, transMemo?: string): {};
    getBalance(): {
        balance: number;
        pendingBalance: number;
    };
    getTransactionHistory(qty?: number): Transaction[];
    addTransaction(entry: Transaction): void;
    calculateBalance(): {
        availableBalance: number;
        pendingBalance: number;
    };
    findId(): number;
}
//# sourceMappingURL=Account.d.ts.map