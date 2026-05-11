import {
    formatTransactions, 
    Transaction,
    TransType,
    Status,
    TransMedia,
} from './Transaction.js';

import { CategoryNames, CategoryNode, findCategoryNode } from './Category.js';
import { rootNode } from './index.js';

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

export class Account {
  private _balance: number = 0;
  private _pendingBalance: number = 0;
  public currencyType: string = 'USD';
  private accountStatus: AccountStatus = AccountStatus.Open;
  private createdAt: Date = new Date();
  private transactions: Transaction[];
  private id: number = this.findId();
  private usedId: number[];

  constructor(
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
    this.id = this.findId();
    this.usedId = [];
  }

  deposit(
    amount: number,
    transMedia: TransMedia,
    category: CategoryNode | undefined = findCategoryNode(rootNode, CategoryNames.OtherIncome),
    transMemo?: string
  ): { success: Boolean; message: string } {
    const transType: TransType = TransType.Credit;

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

  withdraw(
    amount: number,
    transMedia: TransMedia,
    category: CategoryNode | undefined = findCategoryNode(rootNode, CategoryNames.Uncategorized),
    transMemo?: string
  ): {} {
    const transType: TransType = TransType.Debit;
    const entry = new Transaction(
      amount,
      transMedia,
      transMemo ?? undefined,
      category,
      this.transactions.length + 1,
      transType,
      this.id,
      new Date()
    );
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
  }

  getBalance(): { balance: number; pendingBalance: number } {
    return { balance: this._balance, pendingBalance: this._pendingBalance };
    }
    

  getTransactionHistory(qty?: number): Transaction[] {
    if (qty && qty < this.transactions.length) {
      return this.transactions.slice(this.transactions.length - qty);
    } else return this.transactions;
  }

  addTransaction(entry: Transaction): void {
    this.transactions.push(entry);
  }

  calculateBalance(): {
    availableBalance: number;
    pendingBalance: number;
  } {
    let availableBalance: number = 0;
    let pendingBalance: number = 0;

    this.transactions.forEach((entry) => {
      if (entry.transType == TransType.Credit) {
        if (entry.status == Status.Complete) {
          availableBalance += entry.amount;
          pendingBalance += entry.amount;
        } else if (entry.status == Status.Pending) {
          pendingBalance += entry.amount;
        }
      } else if (entry.transType == TransType.Debit) {
        if (entry.status == Status.Complete) {
          availableBalance -= entry.amount;
          pendingBalance -= entry.amount;
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

  findId(): number {
    if (this.usedId) {
      return this.usedId.length + 1;
    } else return 1;
  }
}
