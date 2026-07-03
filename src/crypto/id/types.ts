/**
 * Universally Unique Lexicographically Sortable Identifier
 *
 * @pattern ^[0-7][0-9A-HJKMNP-TV-Z]{8}[0-7][0-9A-HJKMNP-TV-Z]{16}$
 *
 * @example
 *   01KWMHCJ1N9CT18FS6WDV4TG96
 *   01KWMQ4102A5SME4HXECMDPVAE
 *
 * @see RE_ULID
 */
export type ULID = `${number}${string}`;

/**
 * Nano ID
 *
 * @pattern ^[0-9a-zA-Z_-]{21}$
 *
 * @example
 *   hMRgygVUHolGTKCIFsa5J
 *   LUZU4tg_SNhqwdBMeYXCz
 *   8-nwJ_uW48tlcP4MtenPT
 *
 * @see RE_NANO_ID
 */
export type NanoID = `${string | number}`;

/**
 * Universally Unique Lexicographically Sortable Identifier
 * @see ULID
 */
export const RE_ULID = /^[0-7][0-9A-HJKMNP-TV-Z]{8}[0-7][0-9A-HJKMNP-TV-Z]{16}$/;

/**
 * Nano ID
 * @see NanoID
 */
export const RE_NANO_ID = /^[0-9a-zA-Z_-]{21}$/;
