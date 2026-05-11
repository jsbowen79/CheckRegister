import { Transaction } from "./Transaction.js";
export declare enum CategoryNames {
    Housing = "Housing",
    Utilities = "Utilities",
    Food = "Food",
    Dining = "Dining",
    MedicalInsurance = "Medical Insurance",
    Insurance = "Insurance",
    InvestmentIncome = "Investment Income",
    Wages = "Wages",
    Reimbursement = "Reimbursement",
    Other = "Other",
    Uncategorized = "Uncategorized",
    Income = "Income",
    Root = "Root",
    Rent = "Rent",
    Mortgage = "Mortgage",
    HouseRepair = "House Repair",
    VehicleRepair = "Vehicle Repair",
    Electricity = "Electricity",
    Sewer = "Sewer",
    Gas = "Gas",
    Water = "Water",
    Groceries = "Groceries",
    Snacks = "Snacks",
    Candy = "Candy",
    Desert = "Desert",
    Staples = "Staples",
    FastFood = "Fast Food",
    Restaurant = "Restaurant",
    HouseInsurance = "House Insurance",
    Vehicle = "Vehicle",
    LifeInsurance = "Life Insurance",
    Employment = "Employment",
    Transportation = "Transportation",
    Benefits = "Benefits",
    OtherHousing = "Other Housing",
    OtherUtilities = "Other Utilities",
    OtherFood = "Other Food",
    OtherInsurance = "OtherInsurance",
    OtherIncome = "Other Income",
    VehicleInsurance = "Vehicle Insurance",
    Fuel = "Fuel",
    OtherTransportation = "Other Transportation",
    Medical = "Medical"
}
export declare class CategoryNode {
    catName: CategoryNames;
    children: CategoryNode[];
    constructor(name: CategoryNames);
}
export declare function buildCategoryNodes(): CategoryNode;
export declare function findCategoryNode(currentNode: CategoryNode, target: CategoryNames): CategoryNode | undefined;
export declare function listCategories(node: CategoryNode, categoriesList: string[]): string[];
export declare function listTransactionsInCategory(transactions: Transaction[], node: CategoryNode, list: Transaction[], target?: CategoryNode): Transaction[] | null;
//# sourceMappingURL=Category.d.ts.map