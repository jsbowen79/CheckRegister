import { Transaction, TransType, Status, TransMedia } from './Transaction.js';
import { CategoryNames, CategoryNode, findCategoryNode } from './Category.js';
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
    constructor(root, usedId, name, type, owner, accountNumber) {
        this.root = root;
        this.usedId = usedId;
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
    }
    validateAmount(amount) {
        return Number.isFinite(amount) && amount > 0;
    }
    validateCategory(category) {
        if (category instanceof CategoryNode)
            return false;
        else
            return true;
    }
    validateTransaction(transaction) {
        if (this.validateAmount(transaction.amount) &&
            transaction.transMedia &&
            this.validateCategory(transaction.category) &&
            transaction.transType &&
            transaction.id &&
            transaction.accountId &&
            transaction.date &&
            transaction.endingBalance)
            return true;
        else
            return false;
    }
    deposit(amount, transMedia, category = findCategoryNode(this.root, CategoryNames.OtherIncome), transMemo) {
        const transType = TransType.Credit;
        if (this.validateAmount(amount)) {
            const entry = new Transaction(amount, transMedia, transMemo ?? undefined, category, this.transactions.length + 1, transType, this.id, new Date(), this._balance);
            console.log("Transaction Entry: ", entry);
            if (!this.validateTransaction(entry)) {
                console.log("transaction not valid");
                return {
                    success: false,
                    message: 'Transaction not valid.  Please try again',
                };
            }
            else {
                entry.determineStatus();
                this.addTransaction(entry);
                const balances = this.calculateBalance();
                console.log("Balances: ", balances);
                this._balance = balances.availableBalance;
                entry.endingBalance = balances.availableBalance;
                this._pendingBalance = balances.pendingBalance;
                console.log("Balances: ", balances);
                return {
                    success: true,
                    message: `Your new available balance is $${this._balance}. Your balance Pending is $${this._pendingBalance}.  Thank you!`,
                };
            }
        }
        else {
            return {
                success: false,
                message: 'Amount is invalid.  Please try again.',
            };
        }
    }
    withdraw(amount, transMedia, category = findCategoryNode(this.root, CategoryNames.Uncategorized), transMemo) {
        if (!this.validateAmount(amount)) {
            return {
                success: false,
                message: 'Amount is invalid.  Please try again',
            };
        }
        const transType = TransType.Debit;
        const entry = new Transaction(amount, transMedia, transMemo ?? undefined, category, this.transactions.length + 1, transType, this.id, new Date());
        if (this.validateTransaction(entry)) {
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
        else {
            return {
                success: false,
                message: 'Invalid transaction.  Please try again. ',
            };
        }
    }
    getBalance() {
        return { balance: this._balance, pendingBalance: this._pendingBalance };
    }
    getTransactionHistory(qty) {
        if (qty && qty < this.transactions.length && qty > 0) {
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
            const newId = this.usedId.length + 1;
            this.usedId.push(newId);
            return newId;
        }
        else
            return 1;
    }
}
//# sourceMappingURL=Account.js.map