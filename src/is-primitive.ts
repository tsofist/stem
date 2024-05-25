import { Primitive } from './index.js';

export function isPrimitive(it: any): it is Primitive {
    if (it == null) return true;
    const typeOf = typeof it;
    return !(typeOf === 'object' || typeOf === 'function');
}
