/**
 * Converts a string to snake_case.
 *
 * @example
 *   globalSearchModifiers => global_search_modifiers
 *   GlobalSearchModifiers => global_search_modifiers
 *   global-search-modifiers => global_search_modifiers
 *   global_search_modifiers => global_search_modifiers
 *   global search modifiers => global_search_modifiers
 */
export function snakeCase(input: string): string {
    return input
        .replace(/([a-z])([A-Z])/g, '$1_$2') // CamelCase / PascalCase
        .replace(/[\s-]+/g, '_')
        .toLowerCase();
}
