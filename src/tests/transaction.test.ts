//This file utilizes Vitest to perform tests on the Transaction Class. It ensures that 
//transaction objects are assembled correctly and ensures that transaction status's are
//determined correctly, 

import { describe, test, expect, beforeEach } from 'vitest';
import {
  buildCategoryNodes,
  CategoryNames,
  CategoryNode,
  findCategoryNode,
} from '../Category.js';
import { Transaction, TransMedia, Status, TransType } from '../Transaction.js';
import { Account } from '../Account.js';

describe('Transaction Class functions', () => {
  let transaction: Transaction;
  let root: CategoryNode;
  const date = new Date();
  beforeEach(() => {
    root = buildCategoryNodes();
    transaction = new Transaction(
      100.5,
      TransMedia.Cash,
      'Test',
      findCategoryNode(root, CategoryNames.Employment),
      1,
      TransType.Credit,
      123,
      date,
      100.25,
      Status.Complete
    );
  });
  test('Transaction Object Complete', () => {
    transaction = new Transaction(
      100.5,
      TransMedia.Cash,
      'Test',
      findCategoryNode(root, CategoryNames.Employment),
      1,
      TransType.Credit,
      123,
      date,
      100.25,
      Status.Complete
    );

    expect(transaction.amount).toBe(100.5);
    expect(transaction.transMedia).toBe(TransMedia.Cash);
    expect(transaction.transMemo).toBe('Test');
    expect(transaction.category).toBe(
      findCategoryNode(root, CategoryNames.Employment)
    );
    expect(transaction.id).toBe(1);
    expect(transaction.transType).toBe(TransType.Credit);
    expect(transaction.accountId).toBe(123);
    expect(transaction.date).toBe(date);
    expect(transaction.endingBalance).toBe(100.25);
    expect(transaction.status).toBe(Status.Complete);
  });
    
    test('Determines status of Deposits correctly', () => {
        let result: string = transaction.determineStatus();
        expect(transaction.status).toBe(Status.Complete); 
        expect(result).toBe("Transaction Complete"); 
        
        transaction.transMedia = TransMedia.Transfer; 
        result = transaction.determineStatus(); 
        expect(result).toBe("Transaction Complete"); 
        expect(transaction.status).toBe(Status.Complete); 

        transaction.transMedia = TransMedia.Credit; 
        result = transaction.determineStatus(); 
        expect(result).toBe("Transaction Declined.  Deposits are allowed by Cash, Check, or Electronic Transfer"); 
        expect(transaction.status).toBe(Status.Declined); 

        transaction.transMedia = TransMedia.ATM; 
        result = transaction.determineStatus(); 
        expect(result).toBe(
          'Transaction Pending.  Please allow 24 hours for review. Cash Deposits are credited upon review.' +
            '  Checks are subject to a 10 day hold.'
        );
        expect(transaction.status).toBe(Status.Pending); 
    })

    test('Determines status of Withdrawals correctly.', () => {
        transaction.transType = TransType.Debit; 
        let result: string = transaction.determineStatus(); 
        expect(result).toBe("Transaction Complete"); 
        expect(transaction.status).toBe(Status.Complete); 

        transaction.transMedia = TransMedia.Cash; 
        result = transaction.determineStatus();
        expect(result).toBe('Transaction Complete');
        expect(transaction.status).toBe(Status.Complete); 

        transaction.transMedia = TransMedia.Check;
        result = transaction.determineStatus();
        expect(result).toBe('Transaction Complete');
        expect(transaction.status).toBe(Status.Complete); 

        transaction.transMedia = TransMedia.Credit;
        result = transaction.determineStatus();
        expect(result).toBe('Transaction Complete');
        expect(transaction.status).toBe(Status.Complete); 

        transaction.transMedia = TransMedia.Transfer;
        result = transaction.determineStatus();
        expect(result).toBe('Transaction Complete');
        expect(transaction.status).toBe(Status.Complete); 
    })
});
