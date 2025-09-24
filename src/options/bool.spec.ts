import { ovBoolOrType } from './bool';

describe('ovBoolOrType', () => {
    type Options = {
        feature?: string | boolean | null;
    };

    const opt1: Options = { feature: 'val' };
    const opt2: Options = { feature: true };
    const opt3: Options = { feature: false };
    const opt4: Options = { feature: undefined };
    const opt5: Options = {};
    const opt6: Options = { feature: null };

    it('Common usage', () => {
        const r1_1 = ovBoolOrType(opt1.feature);
        expect(r1_1).toBe('val');

        const r1_2 = ovBoolOrType(opt2.feature);
        expect(r1_2).toBeUndefined();

        const r1_3 = ovBoolOrType(opt3.feature);
        expect(r1_3).toBeUndefined();

        const r1_4 = ovBoolOrType(opt4.feature);
        expect(r1_4).toBeUndefined();

        const r1_5 = ovBoolOrType(opt5.feature);
        expect(r1_5).toBeUndefined();

        const r1_6 = ovBoolOrType(opt6.feature);
        expect(r1_6).toBeNull();
    });

    it('With value', () => {
        const r2_1 = ovBoolOrType(opt1.feature, 'default');
        expect(r2_1).toBe('val');

        const r2_2 = ovBoolOrType(opt2.feature, 'default');
        expect(r2_2).toBe('default');

        const r2_3 = ovBoolOrType(opt3.feature, 'default');
        expect(r2_3).toBeUndefined();

        const r2_4 = ovBoolOrType(opt4.feature, 'default');
        expect(r2_4).toBe('default');

        const r2_5 = ovBoolOrType(opt5.feature, 'default');
        expect(r2_5).toBe('default');

        const r2_6 = ovBoolOrType(opt6.feature, 'default');
        expect(r2_6).toBeNull();
    });

    it('With value function', () => {
        const r3_1 = ovBoolOrType(opt1.feature, (v) => (v ? 'def-1' : 'def-2'));
        expect(r3_1).toBe('val');

        const r3_2 = ovBoolOrType(opt2.feature, (v) => (v ? 'def-1' : 'def-2'));
        expect(r3_2).toBe('def-1');

        const r3_3 = ovBoolOrType(opt3.feature, (v) => (v ? 'def-1' : 'def-2'));
        expect(r3_3).toBeUndefined();

        const r3_4 = ovBoolOrType(opt4.feature, (v) => (v ? 'def-1' : 'def-2'));
        expect(r3_4).toBe('def-2');

        const r3_5 = ovBoolOrType(opt5.feature, (v) => (v ? 'def-1' : 'def-2'));
        expect(r3_5).toBe('def-2');

        const r3_6 = ovBoolOrType(opt6.feature, (v) => (v ? 'def-1' : 'def-2'));
        expect(r3_6).toBeNull();
    });
});
