import { isPrimitive } from './is-primitive';

describe('isPrimitive', () => {
    it('simple', () => {
        expect(isPrimitive({})).toStrictEqual(false);
        expect(isPrimitive(Object.create(null))).toStrictEqual(false);
        expect(isPrimitive(new Function(''))).toStrictEqual(false);
        // noinspection JSPrimitiveTypeWrapperUsage
        expect(isPrimitive(new String())).toStrictEqual(false);
        expect(isPrimitive([])).toStrictEqual(false);
        expect(isPrimitive(false)).toStrictEqual(true);
        expect(isPrimitive('')).toStrictEqual(true);
        expect(isPrimitive(Symbol())).toStrictEqual(true);
        expect(isPrimitive(undefined)).toStrictEqual(true);
        expect(isPrimitive(null)).toStrictEqual(true);
        expect(isPrimitive(0)).toStrictEqual(true);
    });
});
