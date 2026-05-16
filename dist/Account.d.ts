/**********************************************************************************************
 * Account Class: This class contains all of the variables and functions needed to create and
 * track information that is commonly needed for account registers.  The variables are all
 * housed within an object of type "Account".  Various functions perform transactions and
 * validate transactions and data.
 ********************************************************************************************/
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
    root: CategoryNode;
    usedId: number[];
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
    constructor(root: CategoryNode, usedId: number[], name: string, type: Type, owner: string, accountNumber: number);
    validateAmount(amount: number): boolean;
    validateCategory(category: CategoryNode): boolean;
    validateTransaction(transaction: Transaction): boolean;
    deposit(amount: number, transMedia: TransMedia, category?: CategoryNode, transMemo?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    withdraw(amount: number, transMedia: TransMedia, category?: CategoryNode, transMemo?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getBalance(): {
        balance: number;
        pendingBalance: number;
    };
    getTransactionHistory(qty?: number): Transaction[];
    addTransaction(entry: Transaction): void;
    /******************************************************************************************************************
     * This Function calculates the account balance dynamically as transactions are added or removed following defined
     * rules.  Deposits go to Pending if they are checks or ATM's.  Deposits are declined if they are from Credit sources.
     * Deposits go to completed if they are cash.  Withdrawals always go to completed.
     *********************************************************************************************************************/
    calculateBalance(): {
        availableBalance: number;
        pendingBalance: number;
    };
    findId(): number;
    saveAccountInfo(): Promise<void>;
    static loadAccountInfo(): Promise<Account | undefined>;
}
//# sourceMappingURL=Account.d.ts.map