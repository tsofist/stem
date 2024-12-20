/**
 * Converts a string to camelCase.
 *
 * @example
 *   globalSearchModifiers => globalSearchModifiers
 *   GlobalSearchModifiers => globalSearchModifiers
 *   global-search-modifiers => globalSearchModifiers
 *   global_search_modifiers => globalSearchModifiers
 *   global search modifiers => globalSearchModifiers
 */
export function camelCase(input: string): string {
    return input
        .replace(/[-_\s]+(.)?/g, (_, char: string) => (char ? char.toUpperCase() : ''))
        .replace(/^(.)/, (char: string) => char.toLowerCase());
}
