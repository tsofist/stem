import { propAt } from './prop-at';

describe('propAt', () => {
    it('returns property for simple key', () => {
        const src = { a: 1 };
        const result = propAt(src, 'a');

        expect(result).toBe(1);
    });

    it('returns nested property', () => {
        const src = { a: { b: { c: 'x' } } };
        const result = propAt(src, 'a.b.c');

        expect(result).toBe('x');
    });

    it('returns array element by numeric path segment', () => {
        const src = { arr: [10, 20, 30] };
        const result = propAt(
            src,
            // @ts-expect-error edge case test
            'arr.2',
        );

        expect(result).toBe(30);
    });

    it('returns undefined for missing property without fallback', () => {
        const src = {};
        const result = propAt(
            src,
            // @ts-expect-error edge case test
            'missing',
        );

        expect(result).toBeUndefined();
    });

    it('returns fallback value for missing property', () => {
        const src = {};
        const result = propAt(
            src,
            // @ts-expect-error edge case test
            'missing',
            42,
        );

        expect(result).toBe(42);
    });

    it('invokes fallback factory for missing property', () => {
        const src = {};
        const factory = jest.fn(() => 'from-factory');

        const result = propAt(
            src,
            // @ts-expect-error edge case test
            'missing',
            factory,
        );

        expect(result).toBe('from-factory');
        expect(factory).toHaveBeenCalledTimes(1);
    });

    it('does not call fallback factory when value exists', () => {
        const src = { a: 5 };
        const factory = jest.fn(() => 'from-factory');

        const result = propAt(src, 'a', factory);

        expect(result).toBe(5);
        expect(factory).not.toHaveBeenCalled();
    });

    it('handles null source and returns undefined without fallback', () => {
        const result = propAt(null as any, 'a');

        expect(result).toBeUndefined();
    });

    it('handles null source and returns fallback when provided', () => {
        const result = propAt(null as any, 'a', 'fb');

        expect(result).toBe('fb');
    });

    it('handles intermediate non-object segment', () => {
        const src = { a: 1 } as any;
        const result = propAt(src, 'a.b');

        expect(result).toBeUndefined();
    });

    it('empty propertyPath returns undefined (current behaviour)', () => {
        const src = { a: 1 };
        const result = propAt(
            src,
            // @ts-expect-error edge case test
            '',
        );

        expect(result).toBeUndefined();
    });
});
