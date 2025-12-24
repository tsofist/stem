import { remap } from './remap';

describe('remap', () => {
    it('maps string keys to values', () => {
        const values = { a: 1, b: 'two', c: true };
        expect(remap({ x: 'a', y: 'b', z: 'c' }, values)).toStrictEqual({
            x: 1,
            y: 'two',
            z: true,
        });
    });

    it('applies formatter functions from a factory', () => {
        const values = { a: 1, b: 'two' };
        const result = remap(
            (fmt) => ({
                x: fmt('a', (v) => (v as number) + 1),
                y: fmt('b', (v) => (v as string).toUpperCase()),
            }),
            values,
        );
        expect(result).toStrictEqual({ x: 2, y: 'TWO' });
    });

    it('accepts function formater items (constants via function)', () => {
        const values = { a: 1 };
        const result = remap({ x: () => 5, y: () => 'hello' }, values);
        expect(result).toStrictEqual({ x: 5, y: 'hello' });
    });

    it('returns undefined for missing keys referenced by string', () => {
        const values = { a: 1 };
        expect(remap({ x: 'missing' as any }, values)).toEqual({ x: undefined });
    });

    it('works with class instances as values', () => {
        class MyClass {
            a = 10;
            b = 'ok';
        }
        const instance = new MyClass() as any;
        expect(remap({ x: 'a', y: 'b' }, instance)).toEqual({ x: 10, y: 'ok' });
    });
});
