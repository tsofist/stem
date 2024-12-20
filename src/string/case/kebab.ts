/**
 * Converts a string to kebab_case.
 *
 * @example
 *   globalSearchModifiers => global-search-modifiers
 *   GlobalSearchModifiers => global-search-modifiers
 *   global-search-modifiers => global-search-modifiers
 *   global_search_modifiers => global-search-modifiers
 *   global search modifiers => global-search-modifiers
 */
export function kebabCase(input: string): string {
    return input
        .replace(/([a-z])([A-Z])/g, '$1-$2') // CamelCase / PascalCase
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}
