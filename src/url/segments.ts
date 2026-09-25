/**
 * Reads segments of a pathname: only empty ones are dropped, nothing else is changed.
 *
 * > Also, you can use argument `to`: array to append segments to, instead of allocating a new one
 *
 * @example
 *   pathnameSegmentsOf('/api//v1/users/')
 *   // ['api', 'v1', 'users']
 *   pathnameSegmentsOf('/a/../b')
 *   // ['a', '..', 'b']
 */
export function pathnameSegmentsOf(pathname: string): string[];
export function pathnameSegmentsOf(pathname: string, to: string[]): string[];
export function pathnameSegmentsOf(pathname: string, target: string[] = []): string[] {
    const { length } = pathname;
    let index = 0;

    while (index < length) {
        while (index < length && pathname.charCodeAt(index) === CC_SLASH) index++;
        if (index >= length) break;

        const start = index;
        while (index < length && pathname.charCodeAt(index) !== CC_SLASH) index++;

        target.push(pathname.slice(start, index));
    }

    return target;
}

const CC_SLASH = 0x2f;
