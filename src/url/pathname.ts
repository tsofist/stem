import type { Nullable, ReadonlyMay } from '../index';
import { pathnameSegmentsOf } from './segments';

/**
 * Builds a pathname from parts, joining them with a single separator.
 *
 * The result is always relative — a leading separator is never kept.
 * A trailing separator is kept if the last non-empty part is a directory one.
 * Nullish and empty parts are skipped and do not affect the trailing separator.
 *
 * Only the separators at the seams between parts are collapsed. Pass `normalize` to collapse the
 * duplicate separators inside the parts as well.
 *
 * Nothing else is changed: spaces are a part of a segment, dot-segments are not resolved.
 *
 * @example
 *   pathnameFrom(['/api/', '/v1//users/', 'profiles/'])
 *   // 'api/v1//users/profiles/'
 *   pathnameFrom(['/api/', '/v1//users/', 'profiles/'], true)
 *   // 'api/v1/users/profiles/'
 *   pathnameFrom(['/', undefined, 'root//child'])
 *   // 'root//child'
 */
export function pathnameFrom(parts: ReadonlyMay<Nullable<string>[]>, normalize = false): string {
    if (normalize) return normalizedPathnameFrom(parts);

    let result = '';

    for (const part of parts) {
        if (!part) continue;
        if (result === '') {
            result = part;
            continue;
        }

        let start = 0;
        while (part.charCodeAt(start) === CC_SLASH) start++;

        let end = result.length;
        while (end > 0 && result.charCodeAt(end - 1) === CC_SLASH) end--;

        result = `${result.slice(0, end)}/${part.slice(start)}`;
    }

    let start = 0;
    while (result.charCodeAt(start) === CC_SLASH) start++;

    return start > 0 ? result.slice(start) : result;
}

/** Joins the parts by their segments, so every duplicate separator is collapsed */
function normalizedPathnameFrom(parts: ReadonlyMay<Nullable<string>[]>): string {
    const segments: string[] = [];
    let endsWithSlash = false;

    for (const part of parts) {
        if (!part) continue;

        pathnameSegmentsOf(part, segments);
        endsWithSlash = part.endsWith('/');
    }

    const result = segments.join('/');
    return endsWithSlash && result ? `${result}/` : result;
}

const CC_SLASH = 0x2f;
