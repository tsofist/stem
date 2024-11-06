import { switchBy } from './switch-by';

/* eslint-disable @typescript-eslint/no-mixed-enums */

describe('switchBy', () => {
    enum V {
        A,
        B,
        C = 'c',
    }

    it('Edge cases', () => {
        const map = {
            [V.A]: 'a A',
            [V.B]: 'a B',
            c: 'a C',
        };
        expect(
            switchBy<V, string>(
                map,
                // @ts-expect-error It's a test
                undefined,
            ),
        ).toStrictEqual(undefined);
        expect(switchBy<V, string>(map, V.C)).toStrictEqual('a C');
        expect(switchBy<V, string>(map, 'C' as V)).toStrictEqual(undefined);
        expect(switchBy<V, string>(map, 'c' as V)).toStrictEqual('a C');
        expect(switchBy<any>({}, null as any)).toStrictEqual(undefined);
    });
    it('Basic w/ Value', () => {
        const map = {
            [V.A]: 'a A',
            [V.B]: 'a B',
            [V.C]: 'a C',
        };
        expect(switchBy<V, string>(map, V.A)).toStrictEqual('a A');
        expect(switchBy<V, string>(map, V.C)).toStrictEqual('a C');
    });
    it('Basic w/ Fn', () => {
        const map = {
            [V.A]: () => 'a A',
            [V.B]: () => 'a B',
            [V.C]: 'a C',
        };
        expect(switchBy<V, string>(map, V.A)).toStrictEqual('a A');
        expect(switchBy<V, string>(map, V.C)).toStrictEqual('a C');
    });
});
