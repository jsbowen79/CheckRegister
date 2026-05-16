/* eslint-disable @typescript-eslint/no-explicit-any */
//This is the most significant test file.  It ensures that accounts are built,
//and that all kinds of transactions are completed appropriately.  It ensures
//that balances are correct in both the available and pending balances.  It
//tests both the deposit and withdraw functions.
import { describe, test, expect, beforeEach } from 'vitest';
import { buildCategoryNodes, CategoryNames, CategoryNode, findCategoryNode, } from '../Category.js';
import { Transaction, TransMedia, Status, TransType } from '../Transaction.js';
import { Account, Type, AccountStatus } from '../Account.js';
describe('Test Account Class', () => {
    const root = buildCategoryNodes();
    const usedIds = [];
    let account;
    beforeEach(() => {
        account = new Account(root, usedIds, 'Credit Union', Type.Checking, 'John Doe', 10001);
    });
    test('Confirm Account created Correctly.', () => {
        const balances = account.getBalance();
        expect(balances).toEqual({ balance: 0, pendingBalance: 0 });
        expect(account.currencyType).toBe('USD');
        expect(account.root).toBeDefined();
        expect(account.name).toBe('Credit Union');
        expect(account.type).toBe(Type.Checking);
        expect(account.owner).toBe('John Doe');
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
        account.deposit(100, TransMedia.ATM, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        expect(account._balance).toBe(0);
        expect(account._pendingBalance).toBe(100);
        expect(account.transactions.length).toBe(1);
        account.deposit(100, TransMedia.Cash, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        expect(account._balance).toBe(100);
        expect(account._pendingBalance).toBe(200);
        expect(account.transactions.length).toBe(2);
        account.deposit(100, TransMedia.Check, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        expect(account._balance).toBe(100);
        expect(account._pendingBalance).toBe(300);
        expect(account.transactions.length).toBe(3);
        account.deposit(100, TransMedia.Credit, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        expect(account._balance).toBe(100);
        expect(account._pendingBalance).toBe(300);
        expect(account.transactions.length).toBe(4);
        account.deposit(100, TransMedia.Transfer, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        expect(account._balance).toBe(200);
        expect(account._pendingBalance).toBe(400);
        expect(account.transactions.length).toBe(5);
    });
    test('Test withdraw function', () => {
        expect(account._balance).toBe(0);
        expect(account._balance).toBe(0);
        account.deposit(1000, TransMedia.Transfer, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        account.deposit(500, TransMedia.Check, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        expect(account._balance).toBe(1000);
        expect(account._pendingBalance).toBe(1500);
        account.withdraw(100, TransMedia.ATM, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        expect(account._balance).toBe(900);
        expect(account._pendingBalance).toBe(1400);
        expect(account.transactions.length).toBe(3);
        account.withdraw(100, TransMedia.Cash, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        expect(account._balance).toBe(800);
        expect(account._pendingBalance).toBe(1300);
        expect(account.transactions.length).toBe(4);
        account.withdraw(100, TransMedia.Check, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        expect(account._balance).toBe(700);
        expect(account._pendingBalance).toBe(1200);
        expect(account.transactions.length).toBe(5);
        account.withdraw(100, TransMedia.Credit, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        expect(account._balance).toBe(600);
        expect(account._pendingBalance).toBe(1100);
        expect(account.transactions.length).toBe(6);
        account.withdraw(100, TransMedia.Transfer, findCategoryNode(root, CategoryNames.Employment), 'Paycheck');
        expect(account._balance).toBe(500);
        expect(account._pendingBalance).toBe(1000);
        expect(account.transactions.length).toBe(7);
    });
    test('Test addTransaction function', () => {
        for (let i = 0; i < 100; i++) {
            const transaction = new Transaction(100, TransMedia.Cash, 'Test', findCategoryNode(root, CategoryNames.Benefits), 1, TransType.Credit, 2, new Date(), Status.Complete);
            account.addTransaction(transaction);
            expect(account.transactions.length).toBe(i + 1);
        }
    });
    test('Test findId function', () => {
        let id;
        account.usedId = [];
        for (let i = 0; i < 100; i++) {
            expect(account.usedId).not.toContain(account.usedId.length + 1);
            id = account.findId();
            expect(account.usedId).toContain(id);
            expect(account.usedId.length).toBe(i + 1);
        }
    });
});
//# sourceMappingURL=account.test.js.map