import { TransMedia, TransType, Transaction, Status, formatTransactions } from "./Transaction.js";
import { Type, AccountStatus, Account } from "./Account.js";
import { CategoryNames, buildCategoryNodes, findCategoryNode, listCategories, listTransactionsInCategory, CategoryNode } from "./Category.js";
const rootNode = buildCategoryNodes();
const testSavings = new Account("Test Savings", Type.Savings, "Joseph Bowen", 123456987);
const deposit = testSavings.deposit(1000.56, TransMedia.Cash, findCategoryNode(rootNode, CategoryNames.OtherIncome), "Tax Refund");
const withd = testSavings.withdraw(.56, TransMedia.Transfer, findCategoryNode(rootNode, CategoryNames.Uncategorized), "To Money Market");
const deposit2 = testSavings.deposit(1000.56, TransMedia.ATM, findCategoryNode(rootNode, CategoryNames.OtherIncome), 'Tax Refund');
const withd2 = testSavings.withdraw(2000.56, TransMedia.Transfer, findCategoryNode(rootNode, CategoryNames.InvestmentIncome), 'To Money Market');
const balances = testSavings.getBalance();
const history2 = testSavings.getTransactionHistory(10);
const list2 = [];
const list3 = listTransactionsInCategory(history2, rootNode, list2, findCategoryNode(rootNode, CategoryNames.OtherIncome));
console.log("Transactions in Category: ", list3);
console.log(formatTransactions(history2));
let list = [];
console.log(listCategories(rootNode, list));
export { rootNode };
//# sourceMappingURL=index.js.map