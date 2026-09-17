import { hasAll } from './has';

describe('hasAll', () => {
    it('1', () => {
        expect(hasAll({ a: 1, b: 2 }, ['a', 'b'])).toBe(true);

        expect(hasAll({}, [])).toBe(false);

        // @ts-expect-error Test Only
        expect(hasAll({ a: 1, b: 2 }, ['a', 'c'])).toBe(false);
        // @ts-expect-error Test Only
        expect(hasAll({ a: 1, b: 2 }, ['c'])).toBe(false);
        // @ts-expect-error Test Only
        expect(hasAll({}, ['a'])).toBe(false);
    });

    it('2', () => {
        const s = '🔇🔈🔉🔊';

        expect(Object.keys(s).length).toBe(s.length);

        expect(hasAll(s, [''])).toBe(false);
        expect(hasAll(s, ['🔉'])).toBe(true);
        expect(hasAll(s, ['🔊', '🔇'])).toBe(true);

        expect(hasAll(s, ['0'])).toBe(false);
        expect(hasAll(s, [0])).toBe(false);

        expect(hasAll(s, ['length'])).toBe(false);
    });

    it('3', () => {
        const s = '👩‍👧‍👧👪🧑‍🧑‍🧒🧑‍🧑‍🧒‍🧒🧑‍🧒🧑‍🧒‍🧒';

        expect(hasAll(s, ['👪'])).toBe(true);
        expect(hasAll(s, ['🧑'])).toBe(false);
    });
});
