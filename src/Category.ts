/*********************************************************************************************************
 * This class is responsible for defining the category classifications that will be available in the
 * program.  The category names and defined by enum to ensure that they are consistent.  The categories
 * are assembled into a category node tree that allows categories to have relationships with other
 * categories.  Later, functionality will be added to allow users to sort transactions by category.
 * This will be done utilizing recursion as the tree structure is perfect for recursion use.
 *********************************************************************************************************/

//Define available category names.

export enum CategoryNames {
  Housing = 'Housing',
  Utilities = 'Utilities',
  Food = 'Food',
  Dining = 'Dining',
  MedicalInsurance = 'Medical Insurance',
  Insurance = 'Insurance',
  InvestmentIncome = 'Investment Income',
  Wages = 'Wages',
  Reimbursement = 'Reimbursement',
  Other = 'Other',
  Uncategorized = 'Uncategorized',
  Income = 'Income',
  Root = 'Root',
  Rent = 'Rent',
  Mortgage = 'Mortgage',
  HouseRepair = 'House Repair',
  VehicleRepair = 'Vehicle Repair',
  Electricity = 'Electricity',
  Sewer = 'Sewer',
  Gas = 'Gas',
  Water = 'Water',
  Groceries = 'Groceries',
  Snacks = 'Snacks',
  Candy = 'Candy',
  Desert = 'Desert',
  Staples = 'Staples',
  FastFood = 'Fast Food',
  Restaurant = 'Restaurant',
  HouseInsurance = 'House Insurance',
  Vehicle = 'Vehicle',
  LifeInsurance = 'Life Insurance',
  Employment = 'Employment',
  Transportation = 'Transportation',
  Benefits = 'Benefits',
  OtherHousing = 'Other Housing',
  OtherUtilities = 'Other Utilities',
  OtherFood = 'Other Food',
  OtherInsurance = 'OtherInsurance',
  OtherIncome = 'Other Income',
  VehicleInsurance = 'Vehicle Insurance',
  Fuel = 'Fuel',
  OtherTransportation = 'Other Transportation',
  Medical = 'Medical',
}

//Create a category node class that saves categories as objects with a name and an array of children.
//This is the basic building block of the Category Tree.

export class CategoryNode {
  public catName: CategoryNames;
  public children: CategoryNode[] = [];

  constructor(name: CategoryNames) {
    this.catName = name;
  }
}

//This function builds the Category tree by defining each category node and its children.  The
//tree will be imported into each account so that it can be used.

export function buildCategoryNodes(): CategoryNode {
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
  const OtherTransportation = new CategoryNode(
    CategoryNames.OtherTransportation
  );
  const Medical = new CategoryNode(CategoryNames.Medical);
  const Uncategorized = new CategoryNode(CategoryNames.Uncategorized);

  Root.children.push(
    Uncategorized,
    Medical,
    Housing,
    Utilities,
    Food,
    Insurance,
    Income,
    Transportation
  );
  Housing.children.push(OtherHousing, Rent, Mortgage, HouseRepair);
  Utilities.children.push(OtherUtilities, Electricity, Sewer, Gas, Water);
  Food.children.push(OtherFood, Groceries, Dining);
  Groceries.children.push(Snacks, Candy, Desert, Staples);
  Dining.children.push(FastFood, Restaurant);
  Insurance.children.push(
    OtherInsurance,
    MedicalInsurance,
    HouseInsurance,
    VehicleInsurance,
    LifeInsurance
  );
  Income.children.push(OtherIncome, Employment, InvestmentIncome, Benefits);
  Transportation.children.push(Vehicle, OtherTransportation);
  Vehicle.children.push(Fuel, VehicleRepair);

  return Root;
}

//This function uses recursion to find the category node that needs to be connected to a transaction.
//This ensures that the transaction will be properly attached to the category node.

export function findCategoryNode(
  currentNode: CategoryNode,
  target: CategoryNames
): CategoryNode | undefined {
  if (!currentNode) return undefined;
  if (currentNode && currentNode.catName === target) {
    return currentNode;
  } else {
    for (const child of currentNode.children) {
      const result = findCategoryNode(child, target);
      if (result != undefined) return result;
    }
    return undefined;
  }
}

//This function uses recursion to display a list of available category nodes.

export function listCategories(
  node: CategoryNode,
  categoriesList: string[]
): string[] {
  if (node.children.length === 0) return categoriesList;
  else {
    for (const child of node.children) {
      categoriesList.push(child.catName.toString());
      listCategories(child, categoriesList);
    }
    return categoriesList;
  }
}
