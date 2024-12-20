import { camelCase } from './camel';

describe('camelCase', () => {
    const cases = [
        ['globalSearchModifiers', 'globalSearchModifiers'], // CamelCase
        ['GlobalSearchModifiers', 'globalSearchModifiers'], // PascalCase
        ['global-search-modifiers', 'globalSearchModifiers'], // kebab-case
        ['global_search_modifiers', 'globalSearchModifiers'], // snake_case
        ['global search modifiers', 'globalSearchModifiers'], // Spaces
    ];

    it.each(cases)('should convert "%s" to camelCase "%s"', (input, expected) => {
        expect(camelCase(input)).toBe(expected);
    });
});
