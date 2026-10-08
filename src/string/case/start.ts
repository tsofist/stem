/**
 * Converts a string to Start Case.
 *
 * @example
 *   globalSearchModifiers => Global Search Modifiers
 *   XMLHttpRequest => XML Http Request
 *   global-search-modifiers => Global Search Modifiers
 */
export function startCase(input: string): string {
    const words =
        input
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/['’]/g, '')
            .match(/\p{Lu}+(?=\p{Lu}\p{Ll}|\P{L}|$)|\p{Lu}?\p{Ll}+\p{N}*|\p{Lu}+\p{N}*|\p{N}+/gu) ??
        [];

    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
