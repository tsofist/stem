import { PositiveInt } from './number/types';
import { Nullable, PromiseMay } from './index';

type OnChunk<T> = (chunk: T) => PromiseMay<void | boolean>;

/**
 * Iterate target chunks
 * @param target
 * @param size size of chunk (must be > 0)
 * @param onChunk will be called on each chunk. Return false to break early
 * @returns true if target is chunkable
 */
export async function chunk<Ch extends string = string>(
    target: Nullable<Ch>,
    size: PositiveInt,
    onChunk?: OnChunk<Ch>,
): Promise<boolean>;
/**
 * Iterate target chunks
 * @param target
 * @param size size of chunk (must be > 0)
 * @param onChunk will be called on each chunk. Return false to break early
 * @returns true if target is chunkable
 */
export async function chunk<T, Ch extends T[] = T[]>(
    target: Nullable<Ch>,
    size: PositiveInt,
    onChunk?: OnChunk<Ch>,
): Promise<boolean>;
export async function chunk<T, Ch extends string | T[] = string | T[]>(
    target: Nullable<Ch>,
    size: PositiveInt,
    onChunk?: OnChunk<Ch>,
): Promise<boolean> {
    const total = target?.length;
    const hasOnChunk = onChunk != null;
    if (total && size > 0) {
        let cur = 0;
        while (cur < total) {
            if (hasOnChunk) {
                const v = await onChunk(target.slice(cur, cur + size) as Ch);
                if (v === false) break;
            }
            cur += size;
        }
        return true;
    }
    return false;
}
