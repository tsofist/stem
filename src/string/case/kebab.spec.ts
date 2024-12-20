import { kebabCase } from './kebab';

describe('kebabCase', () => {
    const cases = [
        ['globalSearchModifiers', 'global-search-modifiers'], // CamelCase
        ['GlobalSearchModifiers', 'global-search-modifiers'], // PascalCase
        ['global-search-modifiers', 'global-search-modifiers'], // kebab-case
        ['global_search_modifiers', 'global-search-modifiers'], // snake_case
        ['global search modifiers', 'global-search-modifiers'], // Spaces
    ];

    test.each(cases)('should convert "%s" to kebab-case "%s"', (input, expected) => {
        expect(kebabCase(input)).toBe(expected);
    });
});
