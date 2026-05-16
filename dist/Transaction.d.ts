/*******************************************************************************************************
 * This Class provides the framework for a transaction.  Each transaction that is performed is assembled
 * into a standard format.  This format can then be stored in an account to keep a permanent record of
 * the transaction.
 ******************************************************************************************************/
import { CategoryNode } from './Category.js';
export declare enum TransType {
    Credit = "Credit",
    Debit = "Debit"
}
export declare enum Status {
    Complete = "Complete",
    Pending = "Pending",
    Declined = "Declined"
}
export declare enum TransMedia {
    Cash = "Cash",
    Credit = "Credit",
    Transfer = "Transfer",
    ATM = "ATM",
    Check = "Check"
}
export declare class Transaction {
    amount: number;
    transMedia: TransMedia;
    transMemo?: string | undefined;
    category?: CategoryNode | undefined;
    id?: number | undefined;
    transType?: TransType | undefined;
    accountId?: number | undefined;
    date?: Date | undefined;
    status?: Status | undefined;
    endingBalance: number;
    constructor(amount: number, transMedia: TransMedia, transMemo?: string | undefined, category?: CategoryNode | undefined, id?: number | undefined, transType?: TransType | undefined, accountId?: number | undefined, date?: Date | undefined, status?: Status | undefined);
    determineStatus(): string;
}
export declare function formatTransactions(item: Transaction | Transaction[]): string;
//# sourceMappingURL=Transaction.d.ts.map