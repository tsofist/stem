import type { Nullable, ReadonlyMay } from '../index';
import { pathnameSegmentsOf } from './segments';

/**
 * Builds a pathname from parts: empty segments and duplicate separators are removed.
 *
 * The result is always relative — a leading separator is never kept.
 * A trailing separator is kept if the last non-empty part is a directory one.
 * Nullish and empty parts are skipped and do not affect the trailing separator.
 *
 * Nothing else is changed: spaces are a part of a segment, dot-segments are not resolved.
 *
 * @example
 *   pathnameFrom(['/api/', '/v1//users/', 'profiles/'])
 *   // 'api/v1/users/profiles/'
 *   pathnameFrom(['/nested//path//', 'deep/'])
 *   // 'nested/path/deep/'
 *   pathnameFrom(['/', undefined, 'root//child'])
 *   // 'root/child'
 */
export function pathnameFrom(parts: ReadonlyMay<Nullable<string>[]>): string {
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
