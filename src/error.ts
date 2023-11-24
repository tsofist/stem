import { asArray } from './as-array';
import { ARec, ArrayMay, Nullable, Primitive, URec } from './index';

export type ErrorCode = `EC_${string}`;

export function raise(message: string): never;
export function raise(message: string, code: ErrorCode): never;
export function raise(message: undefined, code: ErrorCode): never;
export function raise(message: string, context: ARec): never;
export function raise(message: string | undefined, meta?: ErrorCode | ARec): never {
    const metaIsString = typeof meta === 'string';
    const code = meta && metaIsString ? meta : undefined;
    const context = meta && !metaIsString ? meta : undefined;
    throw createError(code, context, message);
}

export function raiseEx(code: ErrorCode, context?: ARec, message?: string): never {
    throw createError(code, context, message);
}

export function readErrorContext<T extends object = URec>(error: Nullable<Error>): T | undefined;
export function readErrorContext<T = unknown>(error: Nullable<Error>, field: string): T | undefined;
export function readErrorContext<T>(error: Nullable<Error>, field?: string): T | undefined {
    if (error && 'context' in error) {
        const result = error.context as ARec;
        if (result && typeof result === 'object') {
            if (!field) return result as T;
            else return result[field] as T;
        }
    }
    return undefined;
}

export function hasErrorContext(error: Nullable<Error>, field?: string, value?: Primitive) {
    if (error && 'context' in error && error.context != null && typeof error.context === 'object') {
        if (!field) return true;
        if (value == null) return field in error.context;
        return (error.context as ARec)[field] === value;
    }
    return false;
}

export function readErrorCode(error: Nullable<Error>): ErrorCode | undefined {
    if (error && 'code' in error) {
        const result = error.code;
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

function createError(code?: ErrorCode, context?: ARec, message?: string): Error {
    const result = new Error(message ?? code);

    if (code) {
        Object.defineProperty(result, 'code', {
            value: code,
            enumerable: true,
            writable: false,
            configurable: false,
        });
    }

    if (context) {
        Object.defineProperty(result, 'context', {
            value: context,
            enumerable: true,
            writable: false,
            configurable: false,
        });
    }

    return result;
}
