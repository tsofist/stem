/**
 * Pick fields from target to a new object
 */
export function pickProps<T, Field extends keyof T>(target: T, fields: Field[]): Pick<T, Field> {
    const result = {} as Pick<T, Field>;
    for (const field of fields) {
        result[field] = target[field];
    }
    return result;
}
