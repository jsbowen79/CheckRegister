/*******************************************************************************************************
 * This Class provides the framework for a transaction.  Each transaction that is performed is assembled
 * into a standard format.  This format can then be stored in an account to keep a permanent record of
 * the transaction.
 ******************************************************************************************************/

import { CategoryNode } from './Category.js';

//Enums are used to limit the available inputs for each variable.

export enum TransType {
  Credit = 'Credit',
  Debit = 'Debit',
}

export enum Status {
  Complete = 'Complete',
  Pending = 'Pending',
  Declined = 'Declined',
}

export enum TransMedia {
  Cash = 'Cash',
  Credit = 'Credit',
  Transfer = 'Transfer',
  ATM = 'ATM',
  Check = 'Check',
}

//This class creates a Transaction object to be saved in the account and provides
//methods necessary to manage the transactions.

export class Transaction {
  public endingBalance: number = 0;

  constructor(
    public amount: number,
    public transMedia: TransMedia,
    public transMemo?: string,
    public category?: CategoryNode,
    public id?: number,
    public transType?: TransType,
    public accountId?: number,
    public date?: Date,
    public status?: Status
  ) {}

  //This method determines the status of a transaction based on the rules.  Available status's are
  //complete, pending, or declined.

  determineStatus(): string {
    let message: string;
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
    } else {
      this.status = Status.Complete;
      message = 'Transaction Complete';
    }
    return message;
  }
}

//This function loops through the transaction list in the account and creates a human readable table showing the transactions.
//It is currently set up for the console, but will eventually prepare data to be placed in the UI.

export function formatTransactions(item: Transaction | Transaction[]): string {
  let formattedString: string;
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
        transaction.date!.toString().padEnd(60) +
        transaction.transType!.toString().padEnd(18) +
        transaction.transMedia.padEnd(20) +
        transaction.amount.toString().padEnd(20) +
        (transaction.endingBalance?.toString() ?? '').padEnd(20) +
        (transaction.category?.catName.toString() ?? '').padEnd(20) +
        (transaction.transMemo ?? '').padEnd(50) +
        '\n';
    });
  } else {
    formattedString +=
      item.date!.toString().padEnd(60) +
      item.transType!.toString().padEnd(18) +
      item.transMedia.padEnd(20) +
      item.amount.toString().padEnd(20) +
      (item.endingBalance?.toString() ?? '').padEnd(20) +
      (item.category?.catName.toString() ?? '').padEnd(20) +
      (item.transMemo ?? '').padEnd(50) +
      '\n';
  }
  return formattedString;
}
