import { describe, test, expect, beforeEach } from 'vitest';
import { buildCategoryNodes, CategoryNames, CategoryNode, findCategoryNode, } from '../Category.js';
describe('Category Tree', () => {
    let root;
    beforeEach(() => {
        root = buildCategoryNodes();
    });
    test('Root exists', () => {
        expect(root.catName).toBe('Root');
    });
    test('Root contains Electricity', () => {
        const electricity = findCategoryNode(root, CategoryNames.Electricity);
        expect(electricity).toBeDefined;
    });
    test('Root contains Restaurant', () => {
        const restaurant = findCategoryNode(root, CategoryNames.Restaurant);
        expect(restaurant).toBeDefined;
    });
});
//# sourceMappingURL=category.test.js.map