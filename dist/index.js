/***********************************************************************************************************
 * This program is the beginning of a check register designed for home users.  This portion is written in
 * TypeScript and serves as the data management modules for the final program.  There is currently no UI
 * The UI will be written in Sprint 3. Author: Joseph Bowen
 ***********************************************************************************************************/
//Import needed modules and Classes
import { TransMedia, formatTransactions } from './Transaction.js';
import { Type, Account } from './Account.js';
import { CategoryNames, buildCategoryNodes, findCategoryNode, listCategories, } from './Category.js';
/*************************************************************************************************************************
 * Create variables needed to demonstrate the program. The rootNode tracks the transaction categories.  The usedId
 * will track id's used to ensure that account Id's aren't duplicated.  The testSavings is an object of Type Account
 * from the Account class.  This object is how all transactions are stored and processed within each individual account
 ************************************************************************************************************************/
const rootNode = buildCategoryNodes();
const usedId = [];
const testSavings = new Account(rootNode, usedId, 'Test Savings', Type.Savings, 'Joseph Bowen', 123456987);
//This is a function that demonstrates the function of the program.  Eventually, this will be completed using a web-based UI
async function run() {
    await testSavings.deposit(1000.56, TransMedia.Cash, findCategoryNode(rootNode, CategoryNames.OtherIncome), 'Tax Refund');
    await testSavings.withdraw(0.56, TransMedia.ATM, findCategoryNode(rootNode, CategoryNames.Uncategorized), 'To Money Market');
    await testSavings.deposit(1000.56, TransMedia.ATM, findCategoryNode(rootNode, CategoryNames.OtherIncome), 'Tax Refund');
    await testSavings.withdraw(2000.56, TransMedia.Transfer, findCategoryNode(rootNode, CategoryNames.InvestmentIncome), 'To Money Market');
    const history2 = testSavings.getTransactionHistory(10);
    console.log('History2: ', history2);
    console.log(formatTransactions(history2));
    const list = [];
    console.log(listCategories(rootNode, list));
    const loadedFile = await Account.loadAccountInfo();
    console.log('loadedFile: ');
    if (loadedFile) {
        console.log(formatTransactions(loadedFile.getTransactionHistory()));
    }
}
run();
//# sourceMappingURL=index.js.map