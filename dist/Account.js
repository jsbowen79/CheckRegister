import { formatTransactions, Transaction, TransType, Status, TransMedia, } from './Transaction.js';
import { CategoryNames, CategoryNode, findCategoryNode } from './Category.js';
import { rootNode } from './index.js';
export var Type;
(function (Type) {
    Type["Checking"] = "Checking";
    Type["Savings"] = "Savings";
    Type["MoneyMarket"] = "MoneyMarket";
    Type["Credit"] = "Credit";
})(Type || (Type = {}));
export var AccountStatus;
(function (AccountStatus) {
    AccountStatus["Open"] = "Open";
    AccountStatus["BankClosed"] = "Bank Closed";
    AccountStatus["CustClosed"] = "Customer Closed";
    AccountStatus["Suspended"] = "Suspended";
    AccountStatus["Frozen"] = "Frozen";
})(AccountStatus || (AccountStatus = {}));
export class Account {
    constructor(name, type, owner, accountNumber) {
        this.name = name;
        this.type = type;
        this.owner = owner;
        this.accountNumber = accountNumber;
        this._balance = 0;
        this._pendingBalance = 0;
        this.currencyType = 'USD';
        this.accountStatus = AccountStatus.Open;
        this.createdAt = new Date();
        this.id = this.findId();
        this._balance = 0;
        this._pendingBalance = 0;
        this.currencyType = 'USD';
        this.accountStatus = AccountStatus.Open;
        this.createdAt = new Date();
        this.transactions = [];
        this.id = this.findId();
        this.usedId = [];
    }
    deposit(amount, transMedia, category = findCategoryNode(rootNode, CategoryNames.OtherIncome), transMemo) {
        const transType = TransType.Credit;
        const entry = new Transaction(amount, transMedia, transMemo ?? undefined, category, this.transactions.length + 1, transType, this.id, new Date(), this._balance);
        entry.determineStatus();
        this.addTransaction(entry);
        const balances = this.calculateBalance();
        this._balance = balances.availableBalance;
        entry.endingBalance = balances.availableBalance;
        this._pendingBalance = balances.pendingBalance;
        return {
            success: true,
            message: `Your new available balance is $${this._balance}. Your balance Pending is $${this._pendingBalance}.  Thank you!`,
        };
    }
    withdraw(amount, transMedia, category = findCategoryNode(rootNode, CategoryNames.Uncategorized), transMemo) {
        const transType = TransType.Debit;
        const entry = new Transaction(amount, transMedia, transMemo ?? undefined, category, this.transactions.length + 1, transType, this.id, new Date());
        const message = entry.determineStatus();
        if (entry.status != Status.Declined) {
            if (amount <= this._balance) {
                this.addTransaction(entry);
                const balances = this.calculateBalance();
                entry.endingBalance = balances.availableBalance;
                this._balance = balances.availableBalance;
                this._pendingBalance = balances.pendingBalance;
            }
            else {
                entry.endingBalance = this._balance;
                entry.status = Status.Declined;
                this.addTransaction(entry);
                return { success: false, message: 'Declined--Insufficient funds' };
            }
        }
        else {
            this.addTransaction(entry);
            return { success: false, message: message };
        }
        return {
            success: true,
            message: `Your new available balance is $${this._balance}. Your balance Pending is $${this._pendingBalance}.  Thank you!`,
        };
    }
    getBalance() {
        return { balance: this._balance, pendingBalance: this._pendingBalance };
    }
    getTransactionHistory(qty) {
        if (qty && qty < this.transactions.length) {
            return this.transactions.slice(this.transactions.length - qty);
        }
        else
            return this.transactions;
    }
    addTransaction(entry) {
        this.transactions.push(entry);
    }
    calculateBalance() {
        let availableBalance = 0;
        let pendingBalance = 0;
        this.transactions.forEach((entry) => {
            if (entry.transType == TransType.Credit) {
                if (entry.status == Status.Complete) {
                    availableBalance += entry.amount;
                    pendingBalance += entry.amount;
                }
                else if (entry.status == Status.Pending) {
                    pendingBalance += entry.amount;
                }
            }
            else if (entry.transType == TransType.Debit) {
                if (entry.status == Status.Complete) {
                    availableBalance -= entry.amount;
                    pendingBalance -= entry.amount;
                }
                else if (entry.status == Status.Pending) {
                    pendingBalance -= entry.amount;
                }
            }
        });
        return {
            availableBalance: availableBalance,
            pendingBalance: pendingBalance,
        };
    }
    findId() {
        if (this.usedId) {
            return this.usedId.length + 1;
        }
        else
            return 1;
    }
}
//# sourceMappingURL=Account.js.map