import { rootNode } from "./index.js";
import { CategoryNode } from "./Category.js";

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


export class Transaction {
  constructor(
    public amount: number,
    public transMedia: TransMedia,
    public transMemo?: string,
    public category?: CategoryNode,
    public id?: number,
    public transType?: TransType,
    public accountId?: number,
    public date?: Date,
    public endingBalance?: number,
    public status?: Status
  ) {}

  
  determineStatus(): string {
      let message: string = '';
      if (this.transType == TransType.Credit) {
          switch (this.transMedia) {
              case TransMedia.Cash:
                  case TransMedia.Transfer:
                      this.status = Status.Complete;
          message = 'Transaction Complete.';
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
                    }
                } else {
                    this.status = Status.Complete;
                    message = 'Transaction Complete';
                }
                return message;
            }
        }
        
    export function formatTransactions(item: Transaction | Transaction[] ): string {
        let formattedString: string; 
        formattedString =
        "Date".toString().padEnd(60) +
        "Transaction Type".toString().padEnd(18) +
        "Transaction Media".padEnd(20) +
        "Amount".toString().padEnd(20) +
        "Balance".toString().padEnd(20) +
        "Category".padEnd(20)+
        "Memo".padEnd(50) +
        "\n"; 
        if (Array.isArray(item)) {
            item.forEach(transaction => {
                formattedString +=
                    transaction.date!.toString().padEnd(60) +
                    transaction.transType!.toString().padEnd(18) +
                    transaction.transMedia.padEnd(20) +
                    transaction.amount.toString().padEnd(20) +
                    transaction.endingBalance?.toString().padEnd(20) +
                    transaction.category!.toString().padEnd(20) +
                    transaction.transMemo?.padEnd(50) +
                    '\n';
            });
        } else {
            formattedString +=
            item.date!.toString().padEnd(60) +
            item.transType!.toString().padEnd(18) +
            item.transMedia.padEnd(20) +
            item.amount.toString().padEnd(20) +
            item.endingBalance?.toString().padEnd(20) +
            item.category!.toString().padEnd(20) +
            item.transMemo?.padEnd(50) +
            '\n';
    }
    return formattedString;
}