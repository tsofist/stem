import { ARec, hasOwnProperty, Nullable } from './index';

/**
 * Checks if the keys of two objects are identical
 */
export function isEqualKeys(value1: Nullable<ARec>, value2: Nullable<ARec>): boolean {
    if (value1 && value2) {
        const k1 = Object.keys(value1);
        const k1len = k1.length;
        const k2 = Object.create(null);
        let k2len = 0;
        for (const key in value2) {
            if (hasOwnProperty.call(value2, key)) {
                k2len++;
                if (k2len > k1len) return false;
                k2[key] = true;
            }
        }
        if (k1.length === k2len) {
            for (const key of k1) {
                if (!(key in k2)) return false;
            }
            return true;
        }
        return false;
    }
    return false;
}
