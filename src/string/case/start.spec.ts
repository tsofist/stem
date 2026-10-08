import { startCase } from './start';

describe('startCase', () => {
    const cases = [
        ['globalSearchModifiers', 'Global Search Modifiers'],
        ['GlobalSearchModifiers', 'Global Search Modifiers'],
        ['XMLHttpRequest', 'XML Http Request'],
        ['global-search-modifiers', 'Global Search Modifiers'],
        ['global_search_modifiers', 'Global Search Modifiers'],
        ['global search modifiers', 'Global Search Modifiers'],
        ["don't stop", 'Dont Stop'],
        ['déjà vu', 'Deja Vu'],
        ['version2Update', 'Version2 Update'],
        ['---', ''],
    ];

    it.each(cases)('converts "%s" to start case "%s"', (input, expected) => {
        expect(startCase(input)).toBe(expected);
    });
});
