import { snakeCase } from './snake';

describe('snakeCase', () => {
    const cases = [
        ['globalSearchModifiers', 'global_search_modifiers'], // CamelCase
        ['GlobalSearchModifiers', 'global_search_modifiers'], // PascalCase
        ['global-search-modifiers', 'global_search_modifiers'], // kebab-case
        ['global_search_modifiers', 'global_search_modifiers'], // snake_case
        ['global search modifiers', 'global_search_modifiers'], // Spaces
    ];

    it.each(cases)('should convert "%s" to snake_case "%s"', (input, expected) => {
        expect(snakeCase(input)).toBe(expected);
    });
});
