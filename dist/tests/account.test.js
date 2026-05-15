import { describe, test, expect, beforeEach } from 'vitest';
import { buildCategoryNodes, CategoryNames, CategoryNode, findCategoryNode, } from '../Category.js';
import { Transaction, TransMedia, Status, TransType } from '../Transaction.js';
import { Account, Type, AccountStatus } from '../Account.js';
describe('Test Account Class', () => {
    const root = buildCategoryNodes();
    const usedIds = [];
    const date = new Date();
    const transactionList = [];
    let account;
    beforeEach(() => {
        account = new Account(root, usedIds, "Credit Union", Type.Checking, "John Doe", 10001);
    });
    test('Confirm Account created Correctly.', () => {
        const balances = account.getBalance();
        expect(balances).toEqual({ balance: 0, pendingBalance: 0 });
        expect(account.currencyType).toBe('USD');
        expect(account.root).toBeDefined();
        expect(account.name).toBe("Credit Union");
        expect(account.type).toBe(Type.Checking);
        expect(account.owner).toBe("John Doe");
        expect(account.accountNumber).toBe(10001);
        expect(account.id).toBeDefined();
        expect(account.accountStatus).toBe(AccountStatus.Open);
        expect(account.transactions).toEqual([]);
        expect(account.id).toBeDefined();
        expect(account.usedId.length).toBe(1);
    });
    test('Test validateAmount function', () => {
        let response = account.validateAmount(1);
        expect(response).toBe(true);
        response = account.validateAmount(-100);
        expect(response).toBe(false);
        response = account.validateAmount(0);
        expect(response).toBe(false);
        response = account.validateAmount(1000000000000000000);
        expect(response).toBe(true);
    });
    test('Test Deposit function', () => {
        account.deposit(100, TransMedia.ATM, findCategoryNode(root, CategoryNames.Employment), "Paycheck");
        expect(account._balance).toBe(0);
        expect(account._pendingBalance).toBe(100);
        expect(account.transactions.length).toBe(1);
        account.deposit(100, TransMedia.Cash, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        console.log(account._balance);
        expect(account._balance).toBe(100);
        expect(account._pendingBalance).toBe(100);
        expect(account.transactions.length).toBe(2);
        account.deposit(100, TransMedia.Check, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        expect(account._balance).toBe(100);
        expect(account._pendingBalance).toBe(200);
        expect(account.transactions.length).toBe(3);
        account.deposit(100, TransMedia.Credit, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        expect(account._balance).toBe(100);
        expect(account._pendingBalance).toBe(200);
        expect(account.transactions.length).toBe(4);
        account.deposit(100, TransMedia.Transfer, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        expect(account._balance).toBe(200);
        expect(account._pendingBalance).toBe(200);
        expect(account.transactions.length).toBe(5);
    });
});
//# sourceMappingURL=account.test.js.map