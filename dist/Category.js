import { rootNode } from "./index.js";
import { Transaction } from "./Transaction.js";
import { Account } from "./Account.js";
export var CategoryNames;
(function (CategoryNames) {
    CategoryNames["Housing"] = "Housing";
    CategoryNames["Utilities"] = "Utilities";
    CategoryNames["Food"] = "Food";
    CategoryNames["Dining"] = "Dining";
    CategoryNames["MedicalInsurance"] = "Medical Insurance";
    CategoryNames["Insurance"] = "Insurance";
    CategoryNames["InvestmentIncome"] = "Investment Income";
    CategoryNames["Wages"] = "Wages";
    CategoryNames["Reimbursement"] = "Reimbursement";
    CategoryNames["Other"] = "Other";
    CategoryNames["Uncategorized"] = "Uncategorized";
    CategoryNames["Income"] = "Income";
    CategoryNames["Root"] = "Root";
    CategoryNames["Rent"] = "Rent";
    CategoryNames["Mortgage"] = "Mortgage";
    CategoryNames["HouseRepair"] = "House Repair";
    CategoryNames["VehicleRepair"] = "Vehicle Repair";
    CategoryNames["Electricity"] = "Electricity";
    CategoryNames["Sewer"] = "Sewer";
    CategoryNames["Gas"] = "Gas";
    CategoryNames["Water"] = "Water";
    CategoryNames["Groceries"] = "Groceries";
    CategoryNames["Snacks"] = "Snacks";
    CategoryNames["Candy"] = "Candy";
    CategoryNames["Desert"] = "Desert";
    CategoryNames["Staples"] = "Staples";
    CategoryNames["FastFood"] = "Fast Food";
    CategoryNames["Restaurant"] = "Restaurant";
    CategoryNames["HouseInsurance"] = "House Insurance";
    CategoryNames["Vehicle"] = "Vehicle";
    CategoryNames["LifeInsurance"] = "Life Insurance";
    CategoryNames["Employment"] = "Employment";
    CategoryNames["Transportation"] = "Transportation";
    CategoryNames["Benefits"] = "Benefits";
    CategoryNames["OtherHousing"] = "Other Housing";
    CategoryNames["OtherUtilities"] = "Other Utilities";
    CategoryNames["OtherFood"] = "Other Food";
    CategoryNames["OtherInsurance"] = "OtherInsurance";
    CategoryNames["OtherIncome"] = "Other Income";
    CategoryNames["VehicleInsurance"] = "Vehicle Insurance";
    CategoryNames["Fuel"] = "Fuel";
    CategoryNames["OtherTransportation"] = "Other Transportation";
    CategoryNames["Medical"] = "Medical";
})(CategoryNames || (CategoryNames = {}));
export class CategoryNode {
    constructor(name) {
        this.children = [];
        this.catName = name;
    }
}
export function buildCategoryNodes() {
    const Root = new CategoryNode(CategoryNames.Root);
    const Housing = new CategoryNode(CategoryNames.Housing);
    const Rent = new CategoryNode(CategoryNames.Rent);
    const Mortgage = new CategoryNode(CategoryNames.Mortgage);
    const HouseRepair = new CategoryNode(CategoryNames.HouseRepair);
    const Utilities = new CategoryNode(CategoryNames.Utilities);
    const Electricity = new CategoryNode(CategoryNames.Electricity);
    const Sewer = new CategoryNode(CategoryNames.Sewer);
    const Gas = new CategoryNode(CategoryNames.Gas);
    const Water = new CategoryNode(CategoryNames.Water);
    const Food = new CategoryNode(CategoryNames.Food);
    const Groceries = new CategoryNode(CategoryNames.Groceries);
    const Dining = new CategoryNode(CategoryNames.Dining);
    const Snacks = new CategoryNode(CategoryNames.Snacks);
    const Candy = new CategoryNode(CategoryNames.Candy);
    const Desert = new CategoryNode(CategoryNames.Desert);
    const Staples = new CategoryNode(CategoryNames.Staples);
    const FastFood = new CategoryNode(CategoryNames.FastFood);
    const Restaurant = new CategoryNode(CategoryNames.Restaurant);
    const Insurance = new CategoryNode(CategoryNames.Insurance);
    const MedicalInsurance = new CategoryNode(CategoryNames.MedicalInsurance);
    const HouseInsurance = new CategoryNode(CategoryNames.HouseInsurance);
    const VehicleInsurance = new CategoryNode(CategoryNames.VehicleInsurance);
    const LifeInsurance = new CategoryNode(CategoryNames.LifeInsurance);
    const InvestmentIncome = new CategoryNode(CategoryNames.InvestmentIncome);
    const Income = new CategoryNode(CategoryNames.Income);
    const Employment = new CategoryNode(CategoryNames.Employment);
    const Benefits = new CategoryNode(CategoryNames.Benefits);
    const OtherHousing = new CategoryNode(CategoryNames.OtherHousing);
    const OtherUtilities = new CategoryNode(CategoryNames.OtherUtilities);
    const OtherFood = new CategoryNode(CategoryNames.OtherFood);
    const OtherInsurance = new CategoryNode(CategoryNames.OtherInsurance);
    const OtherIncome = new CategoryNode(CategoryNames.OtherIncome);
    const Transportation = new CategoryNode(CategoryNames.Transportation);
    const Vehicle = new CategoryNode(CategoryNames.Vehicle);
    const Fuel = new CategoryNode(CategoryNames.Fuel);
    const VehicleRepair = new CategoryNode(CategoryNames.VehicleRepair);
    const OtherTransportation = new CategoryNode(CategoryNames.OtherTransportation);
    const Medical = new CategoryNode(CategoryNames.Medical);
    const Uncategorized = new CategoryNode(CategoryNames.Uncategorized);
    Root.children.push(Uncategorized, Medical, Housing, Utilities, Food, Insurance, Income, Transportation);
    Housing.children.push(OtherHousing, Rent, Mortgage, HouseRepair);
    Utilities.children.push(OtherUtilities, Electricity, Sewer, Gas, Water);
    Food.children.push(OtherFood, Groceries, Dining);
    Groceries.children.push(Snacks, Candy, Desert, Staples);
    Dining.children.push(FastFood, Restaurant);
    Insurance.children.push(OtherInsurance, MedicalInsurance, HouseInsurance, VehicleInsurance, LifeInsurance);
    Income.children.push(OtherIncome, Employment, InvestmentIncome, Benefits);
    Transportation.children.push(Vehicle, OtherTransportation);
    Vehicle.children.push(Fuel, VehicleRepair);
    return Root;
}
export function findCategoryNode(currentNode, target) {
    if (currentNode && currentNode.catName === target) {
        return currentNode;
    }
    else {
        for (const child of currentNode.children) {
            const result = findCategoryNode(child, target);
            if (result != undefined)
                return result;
        }
        return undefined;
    }
}
export function listCategories(node, categoriesList) {
    if (node.children.length === 0)
        return categoriesList;
    else {
        for (const child of node.children) {
            categoriesList.push(child.catName.toString());
            listCategories(child, categoriesList);
        }
        return categoriesList;
    }
}
export function listTransactionsInCategory(transactions, node, list, target) {
    if (node.children.length === 0)
        return list;
    else {
        for (const child of node.children) {
            transactions.forEach(transaction => {
                if (transaction.category === target) {
                    list.push(transaction);
                }
                const result = listTransactionsInCategory(transactions, child, list, target);
                if (result != null) {
                    result.forEach(transaction => {
                        list.push(transaction);
                    });
                }
            });
        }
        return null;
    }
}
//# sourceMappingURL=Category.js.map