import { TransMedia, formatTransactions, } from './Transaction.js';
import { Type, Account } from './Account.js';
import { CategoryNames, buildCategoryNodes, findCategoryNode, listCategories, } from './Category.js';
const rootNode = buildCategoryNodes();
const usedId = [];
const testSavings = new Account(rootNode, usedId, 'Test Savings', Type.Savings, 'Joseph Bowen', 123456987);
function deposit() {
    console.log("in Deposit function");
    testSavings.deposit(1000.56, TransMedia.Cash, findCategoryNode(rootNode, CategoryNames.OtherIncome), 'Tax Refund');
}
deposit();
console.log("Test Savings: ", testSavings);
const withd = testSavings.withdraw(0.56, TransMedia.Transfer, findCategoryNode(rootNode, CategoryNames.Uncategorized), 'To Money Market');
const deposit2 = testSavings.deposit(1000.56, TransMedia.ATM, findCategoryNode(rootNode, CategoryNames.OtherIncome), 'Tax Refund');
const withd2 = testSavings.withdraw(2000.56, TransMedia.Transfer, findCategoryNode(rootNode, CategoryNames.InvestmentIncome), 'To Money Market');
const history2 = testSavings.getTransactionHistory(10);
// console.log(formatTransactions(history2));
// let list: string[] = [];
// console.log(listCategories(rootNode, list));
//# sourceMappingURL=index.js.map