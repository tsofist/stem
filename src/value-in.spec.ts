import { valueIn } from './value-in';

describe('valueIn', () => {
    it('Array', () => {
        const target = [1, 2, 3];

        expect(valueIn(3, target)).toStrictEqual(true);
        expect(valueIn(30, target)).toStrictEqual(false);
        expect(valueIn(-3, target)).toStrictEqual(false);
        expect(valueIn(null, null)).toStrictEqual(false);
        expect(valueIn(null, target)).toStrictEqual(false);
        expect(valueIn(undefined, target)).toStrictEqual(false);
    });
    it('Object', () => {
        const target = {
            a: true,
            b: true,
            c: true,
            string: 'string value',
        };

        expect(valueIn('a', target)).toStrictEqual(true);
        expect(valueIn('a', null)).toStrictEqual(false);
        expect(valueIn('d', target)).toStrictEqual(false);
    });
    it('Enum', () => {
        enum Target {
            A,
            B,
            C,
            M = 100,
        }

        expect(valueIn(Target.A, Target)).toStrictEqual(true);
        expect(valueIn(Target.A, Target, true)).toStrictEqual(true);
        expect(valueIn(2, Target, true)).toStrictEqual(true);
        expect(valueIn(Target.M, Target, true)).toStrictEqual(true);
        expect(valueIn(100, Target, true)).toStrictEqual(true);
    });
    it('String Enum', () => {
        enum Target {
            A = 'a',
            B = 'b',
            C = 'c',
        }

        expect(valueIn(Target.A, Target)).toStrictEqual(false);
        expect(valueIn(Target.A, Target, true)).toStrictEqual(true);
        expect(valueIn('a', Target, true)).toStrictEqual(true);
        expect(valueIn('d', Target, true)).toStrictEqual(false);
    });
});
