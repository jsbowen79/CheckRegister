/**********************************************************************************************
 * Account Class: This class contains all of the variables and functions needed to create and
 * track information that is commonly needed for account registers.  The variables are all
 * housed within an object of type "Account".  Various functions perform transactions and
 * validate transactions and data.
 ********************************************************************************************/
import { Transaction, TransType, Status, TransMedia } from './Transaction.js';
import { writeFile, readFile } from 'fs/promises';
import { buildCategoryNodes, CategoryNames, CategoryNode, findCategoryNode, } from './Category.js';
//Create enums to control the inputs available for different types of variables.
// This simplifies data entry and validation.
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
//Creates an Account Class which stores all information required to manage each account.
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
    //This function validates that numbers input are positive.
    validateAmount(amount) {
        return Number.isFinite(amount) && amount > 0;
    }
    //This function validates that Categories have been entered as CategoryNodes and not strings.
    //This is necessary to allow for tracking of income and expenses by category using recursion.
    validateCategory(category) {
        if (!(category instanceof CategoryNode)) {
            return false;
        }
        else
            return true;
    }
    //This function ensures that all transactions are complete prior to adding them to the account.
    validateTransaction(transaction) {
        if (this.validateAmount(transaction.amount) &&
            transaction.transMedia &&
            this.validateCategory(transaction.category) &&
            transaction.transType &&
            transaction.id != undefined &&
            transaction.accountId != undefined &&
            transaction.date) {
            return true;
        }
        else {
            return false;
        }
    }
    //This function processes deposits of all types into an account. It verifies information,
    //calculates balances, and stores transactions.
    async deposit(amount, transMedia, category = findCategoryNode(this.root, CategoryNames.OtherIncome), transMemo) {
        const transType = TransType.Credit;
        if (this.validateAmount(amount)) {
            const entry = new Transaction(amount, transMedia, transMemo ?? undefined, category, this.transactions.length + 1, transType, this.id, new Date());
            if (!this.validateTransaction(entry)) {
                return {
                    success: false,
                    message: 'Transaction not valid.  Please try again',
                };
            }
            else {
                entry.determineStatus();
                this.addTransaction(entry);
                const balances = this.calculateBalance();
                this._pendingBalance = balances.pendingBalance;
                this._balance = balances.availableBalance;
                await this.saveAccountInfo();
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
    //This function processes withdrawals of all types.
    async withdraw(amount, transMedia, category = findCategoryNode(this.root, CategoryNames.Uncategorized), transMemo) {
        if (!this.validateAmount(amount)) {
            return {
                success: false,
                message: 'Amount is invalid.  Please try again',
            };
        }
        const transType = TransType.Debit;
        const entry = new Transaction(amount, transMedia, transMemo ?? undefined, category, this.transactions.length + 1, transType, this.id, new Date());
        if (this.validateTransaction(entry)) {
            if (amount <= this._balance) {
                const message = entry.determineStatus();
                if (entry.status != Status.Declined) {
                    this.addTransaction(entry);
                    const balances = this.calculateBalance();
                    this._pendingBalance = balances.pendingBalance;
                    this._balance = balances.availableBalance;
                    await this.saveAccountInfo();
                    return { success: true, message: message };
                }
                else {
                    this.addTransaction(entry);
                    await this.saveAccountInfo();
                    return { success: false, message: message };
                }
            }
            else {
                entry.status = Status.Declined;
                this.addTransaction(entry);
                this.calculateBalance();
                await this.saveAccountInfo();
                return { success: false, message: 'Declined--Insufficient funds' };
            }
        }
        else {
            return {
                success: false,
                message: 'Invalid transaction.  Please try again. ',
            };
        }
    }
    //This function serves as a getter to allow access to the private balances.
    getBalance() {
        return { balance: this._balance, pendingBalance: this._pendingBalance };
    }
    //This function was designed to allow for the UI to display groups of transactions on the screen
    //using forward and back buttons.
    getTransactionHistory(qty) {
        if (qty && qty < this.transactions.length && qty > 0) {
            return this.transactions.slice(this.transactions.length - qty);
        }
        else
            return this.transactions;
    }
    //This function adds a transaction to the transaction list.
    addTransaction(entry) {
        this.transactions.push(entry);
    }
    /******************************************************************************************************************
     * This Function calculates the account balance dynamically as transactions are added or removed following defined
     * rules.  Deposits go to Pending if they are checks or ATM's.  Deposits are declined if they are from Credit sources.
     * Deposits go to completed if they are cash.  Withdrawals always go to completed.
     *********************************************************************************************************************/
    calculateBalance() {
        let availableBalance = 0;
        let pendingBalance = 0;
        this.transactions.forEach((entry) => {
            if (entry.transType == TransType.Credit) {
                if (entry.status == Status.Complete) {
                    availableBalance += entry.amount;
                    pendingBalance += entry.amount;
                    entry.endingBalance = availableBalance;
                }
                else if (entry.status == Status.Pending) {
                    pendingBalance += entry.amount;
                    entry.endingBalance = availableBalance;
                }
            }
            else if (entry.transType == TransType.Debit) {
                if (entry.status == Status.Complete) {
                    availableBalance -= entry.amount;
                    pendingBalance -= entry.amount;
                    entry.endingBalance = availableBalance;
                }
                else if (entry.status == Status.Pending) {
                    pendingBalance -= entry.amount;
                    entry.endingBalance = availableBalance;
                }
                else if (entry.status == Status.Declined) {
                    entry.endingBalance = availableBalance;
                }
            }
        });
        return {
            availableBalance: availableBalance,
            pendingBalance: pendingBalance,
        };
    }
    //This function assigns an unused account id for internal use.
    findId() {
        if (this.usedId) {
            const newId = this.usedId.length + 1;
            this.usedId.push(newId);
            return newId;
        }
        else
            return 1;
    }
    //This async function saves the account object as a serialized json string.
    async saveAccountInfo() {
        try {
            const data = JSON.stringify(this, null, 2);
            await writeFile('account.json', data);
            console.log('transactions saved.');
        }
        catch (error) {
            console.log('Error saving Account: ', error);
        }
    }
    //This async function loads a json string from a file and deserializes the data back into
    //an Account object useable by the program.
    static async loadAccountInfo() {
        try {
            const data = await readFile('./account.json', { encoding: 'utf8' });
            // console.log('Loaded Data: ', data);
            const parsedAccount = JSON.parse(data);
            const root = buildCategoryNodes();
            const account = new Account(root, parsedAccount.usedId, parsedAccount.name, parsedAccount.type, parsedAccount.owner, parsedAccount.accountNumber);
            account._balance = parsedAccount._balance;
            account._pendingBalance = parsedAccount._pendingBalance;
            account.currencyType = parsedAccount.currencyType;
            account.accountStatus = parsedAccount.accountStatus;
            account.createdAt = new Date(parsedAccount.createdAt);
            account.transactions = parsedAccount.transactions.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (t) => new Transaction(t.amount, t.transMedia, t.transMemo, findCategoryNode(root, t.category.catName), t.id, t.transType, t.accountId, new Date(t.date), t.status));
            account.id = parsedAccount.id;
            account.calculateBalance();
            return account;
        }
        catch (error) {
            console.log('Error loading Account.', error);
            return undefined;
        }
    }
}
//# sourceMappingURL=Account.js.map