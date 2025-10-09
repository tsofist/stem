/**
 * NumericDate.
 *
 * ---
 *
 * A JSON numeric value representing the number of seconds from
 *  1970-01-01T00:00:00Z UTC until the specified UTC date/time, ignoring leap seconds.
 *
 * This is equivalent to the definition of "Seconds Since the Epoch" in IEEE Std 1003.1, 2013 Edition [POSIX.1],
 *  in which each day is accounted for exactly 86400 seconds, except that
 *  non-integer values can be represented.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7519#section-2 RFC 7519 - Terminology
 * @see https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_16 POSIX.1-2017: Seconds Since the Epoch
 * @see https://en.wikipedia.org/wiki/Unix_time Wikipedia: Unix time
 * @see https://www.epochconverter.com/ Epoch Converter: Epoch & Unix Timestamp Conversion Tools
 */
export type JWTNumericDate = number;

/**
 * StringOrURI.
 *
 * ---
 *
 * A JSON string value that is either:
 *   - If it contains a colon (":"), a valid URI
 *   - Compared in a case-sensitive manner
 *   - No transformations or canonicalizations are performed on such strings
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7519#section-2 RFC 7519 - Terminology
 * @see https://en.wikipedia.org/wiki/Uniform_Resource_Identifier Wikipedia: Uniform Resource Identifier
 */
export type JWTStringOrURI = string;
