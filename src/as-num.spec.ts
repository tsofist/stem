import { asNum } from './as-num.js';

describe('asNum', () => {
    it('for number', () => {
        expect(asNum(3)).toStrictEqual(3);
        expect(asNum(0)).toStrictEqual(0);
        expect(asNum(null)).toStrictEqual(0);
    });
    it('for string', () => {
        expect(asNum('3')).toStrictEqual(3);
        expect(asNum('0')).toStrictEqual(0);
        expect(asNum('01.1')).toStrictEqual(1.1);
        expect(asNum('01,1')).toStrictEqual(1);
        expect(asNum('')).toStrictEqual(0);
    });
    it('for object', () => {
        expect(asNum({})).toStrictEqual(0);
        expect(asNum({ a: 1 })).toStrictEqual(0);
    });
    it('for object', () => {
        expect(asNum({})).toStrictEqual(0);
        expect(asNum({ a: 1 })).toStrictEqual(0);
    });
    it('for boolean', () => {
        expect(asNum(false)).toStrictEqual(0);
        expect(asNum(true)).toStrictEqual(1);
    });
});
