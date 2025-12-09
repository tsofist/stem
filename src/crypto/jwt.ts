/**
 * A string representing a set of claims as a JSON object that is
 *   encoded in a JWS or JWE, enabling the claims to be digitally
 *   signed or MACed and/or encrypted.
 *
 * #### Format
 * ```
 * BASE64URL(header) + "." + BASE64URL(payload) + "." + BASE64URL(signature)
 * ```
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7519
 * @see https://auth0.com/blog/demystifying-jose-jwt-family/ Auth0: Demystifying JOSE, the JWT Family: JWS, JWE, JWA, and JWK Explained
 * @see https://www.jwt.io/introduction#what-is-json-web-token Introduction to JSON Web Tokens
 *
 */
export type JSONWebToken = string;

/**
 * `NumericDate` / _Claim Value Type_
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
 * `StringOrURI` / _Claim Value Type_
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
