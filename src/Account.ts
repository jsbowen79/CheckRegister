/**********************************************************************************************
 * Account Class: This class contains all of the variables and functions needed to create and 
 * track information that is commonly needed for account registers.  The variables are all 
 * housed within an object of type "Account".  Various functions perform transactions and 
 * validate transactions and data. 
 ********************************************************************************************/

import { Transaction, TransType, Status, TransMedia } from './Transaction.js';

import { CategoryNames, CategoryNode, findCategoryNode } from './Category.js';

//Create enums to control the inputs available for different types of variables.  
// This simplifies data entry and validation.  
export enum Type {
  Checking = 'Checking',
  Savings = 'Savings',
  MoneyMarket = 'MoneyMarket',
  Credit = 'Credit',
}

export enum AccountStatus {
  Open = 'Open',
  BankClosed = 'Bank Closed',
  CustClosed = 'Customer Closed',
  Suspended = 'Suspended',
  Frozen = 'Frozen',
}

//Creates an Account Class which stores all information required to manage each account. 

export class Account {
  private _balance: number = 0;
  private _pendingBalance: number = 0;
  public currencyType: string = 'USD';
  private accountStatus: AccountStatus = AccountStatus.Open;
  private createdAt: Date = new Date();
  private transactions: Transaction[];
  private id: number = this.findId();
  

  constructor(
    public root: CategoryNode,
    public usedId: number[],
    public name: string,
    public type: Type,
    public owner: string,
    public accountNumber: number
  ) {
    this._balance = 0;
    this._pendingBalance = 0;
    this.currencyType = 'USD';
    this.accountStatus = AccountStatus.Open;
    this.createdAt = new Date();
    this.transactions = [];
  }

  //This function validates that numbers input are positive. 

  validateAmount(amount: number): boolean {
    return Number.isFinite(amount) && amount > 0;
  }

  //This function validates that Categories have been entered as CategoryNodes and not strings.
  //This is necessary to allow for tracking of income and expenses by category using recursion.  

  validateCategory(category: CategoryNode | any): boolean {
    if (!(category instanceof CategoryNode)) {
      
      return false
    }
    else return true;
  }

  //This function ensures that all transactions are complete prior to adding them to the account. 

  validateTransaction(transaction: Transaction): boolean {
    if (
      this.validateAmount(transaction.amount) &&
      transaction.transMedia &&
      this.validateCategory(transaction.category!) &&
      transaction.transType &&
      transaction.id != undefined &&
      transaction.accountId != undefined &&
      transaction.date &&
      transaction.endingBalance != undefined
    ) {
      return true;
    } else {
      return false;
    }
  }

  //This function processes deposits of all types into an account. It verifies information, 
  //calculates balances, and stores transactions. 

  deposit(
    amount: number,
    transMedia: TransMedia,
    category: CategoryNode = findCategoryNode(
      this.root,
      CategoryNames.OtherIncome
    )!,
    transMemo?: string
  ): { success: Boolean; message: string } {
    const transType: TransType = TransType.Credit;
    if (this.validateAmount(amount)) {
      const entry = new Transaction(
        amount,
        transMedia,
        transMemo ?? undefined,
        category,
        this.transactions.length + 1,
        transType,
        this.id,
        new Date(),
        this._balance
      );
      if (!this.validateTransaction(entry)) {
        return {
          success: false,
          message: 'Transaction not valid.  Please try again',
        };
      } else {
        entry.determineStatus();
        this.addTransaction(entry);
        const balances = this.calculateBalance();
  
        this._balance = balances.availableBalance;
        this._pendingBalance = balances.pendingBalance;
        return {
          success: true,
          message: `Your new available balance is $${this._balance}. Your balance Pending is $${this._pendingBalance}.  Thank you!`,
        };
      }
    } else {
      return {
        success: false,
        message: 'Amount is invalid.  Please try again.',
      };
    }
  }

  //This function processes withdrawals of all types.  

  withdraw(
    amount: number,
    transMedia: TransMedia,
    category: CategoryNode = findCategoryNode(
      this.root,
      CategoryNames.Uncategorized
    )!,
    transMemo?: string
  ): {} {
    if (!this.validateAmount(amount)) {
      return {
        success: false,
        message: 'Amount is invalid.  Please try again',
      };
    }
    const transType: TransType = TransType.Debit;
    const entry = new Transaction(
      amount,
      transMedia,
      transMemo ?? undefined,
      category,
      this.transactions.length + 1,
      transType,
      this.id,
      new Date(), 
      this._balance
    );
    if (this.validateTransaction(entry)) {
      const message: string = entry.determineStatus();
      if (entry.status != Status.Declined) {
        if (amount <= this._balance) {
          this.addTransaction(entry);
          const balances = this.calculateBalance();
          entry.endingBalance = balances.availableBalance;
          this._balance = balances.availableBalance;
          this._pendingBalance = balances.pendingBalance;
        } else {
          entry.endingBalance = this._balance;
          entry.status = Status.Declined;
          this.addTransaction(entry);
          return { success: false, message: 'Declined--Insufficient funds' };
        }
      } else {
        this.addTransaction(entry);
        return { success: false, message: message };
      }
      return {
        success: true,
        message: `Your new available balance is $${this._balance}. Your balance Pending is $${this._pendingBalance}.  Thank you!`,
      };
    } else {
      return {
        success: false,
        message: 'Invalid transaction.  Please try again. ',
      };
    }
  }

  //This function serves as a getter to allow access to the private balances. 

  getBalance(): { balance: number; pendingBalance: number } {
    return { balance: this._balance, pendingBalance: this._pendingBalance };
  }

  //This function was designed to allow for the UI to display groups of transactions on the screen 
  //using forward and back buttons. 

  getTransactionHistory(qty?: number): Transaction[] {
    if (qty && qty < this.transactions.length && qty > 0) {
      return this.transactions.slice(this.transactions.length - qty);
    } else return this.transactions;
  }

  //This function adds a transaction to the transaction list.  

  addTransaction(entry: Transaction): void {
    this.transactions.push(entry);
  }

  /******************************************************************************************************************
   * This Function calculates the account balance dynamically as transactions are added or removed following defined 
   * rules.  Deposits go to Pending if they are checks or ATM's.  Deposits are declined if they are from Credit sources. 
   * Deposits go to completed if they are cash.  Withdrawals always go to completed.  
   *********************************************************************************************************************/
   
  calculateBalance(): {
    availableBalance: number;
    pendingBalance: number;
  } {
    let availableBalance: number = 0;
    let pendingBalance: number = 0;

    let i=0; 
    this.transactions.forEach((entry) => {
      i++
      if (entry.transType == TransType.Credit) {
        
        if (entry.status == Status.Complete) {
          availableBalance += entry.amount;
          pendingBalance += entry.amount;
          entry.endingBalance = availableBalance; 

        } else if (entry.status == Status.Pending) {
          pendingBalance += entry.amount;
        }
      } else if (entry.transType == TransType.Debit) {
        if (entry.status == Status.Complete) {
          availableBalance -= entry.amount;
          pendingBalance -= entry.amount;
          entry.endingBalance = availableBalance; 
        } else if (entry.status == Status.Pending) {
          pendingBalance -= entry.amount;
        }
      }
    });

    return {
      availableBalance: availableBalance,
      pendingBalance: pendingBalance,
    };
  }

//This function assigns an unused account id for internal use.  

  findId(): number {
    if (this.usedId) {
      const newId = this.usedId.length + 1; 
      this.usedId.push(newId); 
      return newId;
    } else return 1;
  }
}
