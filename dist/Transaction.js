import { CategoryNode } from './Category.js';
export var TransType;
(function (TransType) {
    TransType["Credit"] = "Credit";
    TransType["Debit"] = "Debit";
})(TransType || (TransType = {}));
export var Status;
(function (Status) {
    Status["Complete"] = "Complete";
    Status["Pending"] = "Pending";
    Status["Declined"] = "Declined";
})(Status || (Status = {}));
export var TransMedia;
(function (TransMedia) {
    TransMedia["Cash"] = "Cash";
    TransMedia["Credit"] = "Credit";
    TransMedia["Transfer"] = "Transfer";
    TransMedia["ATM"] = "ATM";
    TransMedia["Check"] = "Check";
})(TransMedia || (TransMedia = {}));
export class Transaction {
    constructor(amount, transMedia, transMemo, category, id, transType, accountId, date, endingBalance, status) {
        this.amount = amount;
        this.transMedia = transMedia;
        this.transMemo = transMemo;
        this.category = category;
        this.id = id;
        this.transType = transType;
        this.accountId = accountId;
        this.date = date;
        this.endingBalance = endingBalance;
        this.status = status;
    }
    determineStatus() {
        let message = '';
        if (this.transType == TransType.Credit) {
            switch (this.transMedia) {
                case TransMedia.Cash:
                case TransMedia.Transfer:
                    this.status = Status.Complete;
                    message = 'Transaction Complete';
                    break;
                case TransMedia.Credit:
                    this.status = Status.Declined;
                    message =
                        'Transaction Declined.  Deposits are allowed by Cash, Check, or Electronic Transfer';
                    break;
                case TransMedia.ATM:
                case TransMedia.Check:
                    this.status = Status.Pending;
                    message =
                        'Transaction Pending.  Please allow 24 hours for review. Cash Deposits are credited upon review.' +
                            '  Checks are subject to a 10 day hold.';
                    break;
                default:
                    this.status = Status.Declined;
                    message = 'Invalid Transaction Media';
            }
        }
        else {
            this.status = Status.Complete;
            message = 'Transaction Complete';
        }
        return message;
    }
}
export function formatTransactions(item) {
    let formattedString;
    formattedString =
        'Date'.toString().padEnd(60) +
            'Transaction Type'.toString().padEnd(18) +
            'Transaction Media'.padEnd(20) +
            'Amount'.toString().padEnd(20) +
            'Balance'.toString().padEnd(20) +
            'Category'.padEnd(20) +
            'Memo'.padEnd(50) +
            '\n';
    if (Array.isArray(item)) {
        item.forEach((transaction) => {
            formattedString +=
                transaction.date.toString().padEnd(60) +
                    transaction.transType.toString().padEnd(18) +
                    transaction.transMedia.padEnd(20) +
                    transaction.amount.toString().padEnd(20) +
                    (transaction.endingBalance?.toString() ?? '').padEnd(20) +
                    (transaction.category?.toString() ?? '').padEnd(20) +
                    (transaction.transMemo ?? '').padEnd(50) +
                    '\n';
        });
    }
    else {
        formattedString +=
            item.date.toString().padEnd(60) +
                item.transType.toString().padEnd(18) +
                item.transMedia.padEnd(20) +
                item.amount.toString().padEnd(20) +
                (item.endingBalance?.toString() ?? '').padEnd(20) +
                (item.category?.toString() ?? '').padEnd(20) +
                (item.transMemo ?? '').padEnd(50) +
                '\n';
    }
    return formattedString;
}
//# sourceMappingURL=Transaction.js.map