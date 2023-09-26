/**
 * E.164-like phone number string
 * @see https://en.wikipedia.org/wiki/E.164 E.164 on wiki
 * @pattern ^\+\d{8,15}$
 */
export type StringPhoneNumber = string;

/**
 * Numeric representation for phone number
 * @see https://github.com/google/libphonenumber/blob/master/FALSEHOODS.md FALSEHOODS about phone numbers
 * @see https://en.wikipedia.org/wiki/MSISDN en.wiki
 * @see https://ru.wikipedia.org/wiki/MSISDN ru.wiki
 *
 * @asType integer
 * @minimum 10000000
 * @maximum 999999999999999
 */
export type MSISDN = number;
