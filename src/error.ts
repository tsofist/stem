import { asArray } from './as-array';
import { ARec, ArrayMay, Nullable } from './index';

export type ErrorCode = `EC_${string}`;

export function raise(message: string): never;
export function raise(message: string, code: ErrorCode): never;
export function raise(message: undefined, code: ErrorCode): never;
export function raise(message: string, context: ARec): never;
export function raise(message: string | undefined, meta?: any): never {
    const metaIsString = typeof meta === 'string';
    const result = new Error(message);
    if (meta) {
        if (message === '' && metaIsString) result.message = meta;

        Object.defineProperty(result, metaIsString ? 'code' : 'context', {
            value: meta,
            enumerable: true,
            writable: false,
            configurable: false,
        });
    }
    throw result;
}

export function readErrorCode(error: Nullable<Error>): ErrorCode | undefined {
    if (error && 'code' in error) {
        const result = error['code'];
        if (typeof result === 'string') return result as ErrorCode;
    }
    return undefined;
}

export function hasErrorCode(error: Nullable<Error>, code: ErrorCode): boolean {
    return readErrorCode(error) === code;
}

export function matchErrorMessage(error: any, re: RegExp): RegExpMatchArray | string[] {
    if (error) {
        const message = error + '';
        return message.match(re) || [];
    }
    return [];
}

/**
 * Error message contains text (with case-insensitive)
 */
export function testErrorMessage(error: any, text: ArrayMay<string>): boolean;
/**
 * Error message match to RegExp
 */
export function testErrorMessage(error: any, re: ArrayMay<RegExp>): boolean;
export function testErrorMessage(error: any, math: ArrayMay<RegExp | string>): boolean {
    if (error && math) {
        const message = error + '';
        return asArray(math).some((m) => {
            if (m instanceof RegExp) return m.test(message);
            return message.toLowerCase().includes(m.toLowerCase());
        });
    }
    return false;
}
