import type { NonNegativeInt } from '../number/integer/types';

/**
 * @example
 * ```
 *   2026
 *   2026.01
 *   10.3.120
 * ```
 * @see SoftwareVersionRaw
 */
export type SoftwareVersion = `${number}${VPart}${VPart}`;

/**
 * @example
 * ```
 *   2026
 *   2026.01
 *   10.3.120
 *   10.3.120-draft
 *   10.3.120-beta.1
 *   10.3.120-alpha.3+feature-4752
 *   10.3.120+4870
 * ```
 * @see SoftwareVersion
 */
export type SoftwareVersionRaw = `${number}${VPart}${VPart}${'' | SoftwareVersionSuffixRaw}`;

/**
 * @example
 * ```
 *   -draft
 *   -beta.1
 *   -alpha.3+feature-4752
 *   +4870
 * ```
 * @see SoftwareVersionRaw
 */
export type SoftwareVersionSuffixRaw = `+${number}` | `-${string}`;

export type SoftwareVersionDef = {
    raw: SoftwareVersionRaw;
    value: SoftwareVersion;
    suffix?: string;
    build?: NonNegativeInt;
};

/**
 * @example
 * ```
 *   @tsofist/stem
 * ```
 */
export type ScopedPackageName = `@${string}/${string}`;

type VPart = `` | `.${number}`;
