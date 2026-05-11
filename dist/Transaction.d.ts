import { CategoryNode } from "./Category.js";
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
    endingBalance?: number | undefined;
    status?: Status | undefined;
    constructor(amount: number, transMedia: TransMedia, transMemo?: string | undefined, category?: CategoryNode | undefined, id?: number | undefined, transType?: TransType | undefined, accountId?: number | undefined, date?: Date | undefined, endingBalance?: number | undefined, status?: Status | undefined);
    determineStatus(): string;
}
export declare function formatTransactions(item: Transaction | Transaction[]): string;
//# sourceMappingURL=Transaction.d.ts.map