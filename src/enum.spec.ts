import { EnumKeys, EnumValues, extractEnumKeys, extractEnumValues } from './enum';

describe('enum', () => {
    describe('extractEnumKeys', () => {
        it('should extract keys from numeric enum', () => {
            enum Alpha {
                A,
                B,
                C,
            }
            const keys = extractEnumKeys(Alpha);
            expect(keys).toStrictEqual(['A', 'B', 'C']);
        });

        it('should extract keys from string enum', () => {
            enum Alpha {
                A = 'A',
                B = 'B',
                C = 'C',
            }
            const keys = extractEnumKeys(Alpha);
            expect(keys).toStrictEqual(['A', 'B', 'C']);
        });

        it('should extract keys from heterogeneous enum', () => {
            enum Alpha {
                A = 'A',
                B = 1,
                B1 = 1.1,
                C = 'C',
            }
            const keys = extractEnumKeys(Alpha);
            expect(keys).toStrictEqual(['A', 'B', 'B1', 'C']);
        });
    });

    describe('extractEnumValues', () => {
        it('should extract values from numeric enum', () => {
            enum Alpha {
                A,
                B,
                C,
            }
            const values = extractEnumValues(Alpha);
            expect(values).toStrictEqual([0, 1, 2]);
        });

        it('should extract values from string enum', () => {
            enum Alpha {
                A = 'A',
                B = 'B',
                C = 'C',
            }
            const values = extractEnumValues(Alpha);
            expect(values).toStrictEqual(['A', 'B', 'C']);
        });

        it('should extract values from heterogeneous enum', () => {
            enum Alpha {
                A = 'A',
                B = 1,
                B1 = 1.1,
                C = 'C',
            }
            const values = extractEnumValues(Alpha);
            expect(values).toStrictEqual(['A', 1, 1.1, 'C']);
        });

        it('should extract values from computed enum', () => {
            enum Access {
                /*1*/ None, // 0
                /*2*/ Read = 1 << 1, // 2
                /*4*/ Write = 1 << 2, // 4
                /*3*/ ReadWrite = Read | Write, // 6
                /*0*/ G = '123'.length, // 3
            }
            const values = extractEnumValues(Access);
            expect(values).toStrictEqual([3, 0, 2, 6, 4]);
        });
    });

    describe('EnumKeys', () => {
        it('should be ok', () => {
            enum Alpha {
                A,
                B,
                C,
            }
            type AlphaKey = EnumKeys<typeof Alpha>; // "A" | "B" | "C"
            const keys: AlphaKey[] = [
                'A',
                // @ts-expect-error Type '"D"' is not assignable to type 'AlphaKey'.
                'D',
            ];
            expect(keys).toBeDefined();
        });
    });

    describe('EnumValues', () => {
        it('should be ok (numbers)', () => {
            enum Alpha {
                A,
                C,
                F = 17,
            }
            type AlphaValues = EnumValues<typeof Alpha>;
            const values: AlphaValues[] = [
                Alpha.A,
                Alpha.C,
                0,
                1,
                17,
                // @ts-expect-error Type '2' is not assignable to type 'AlphaValues'.
                2,
                // @ts-expect-error Type '18' is not assignable to type 'AlphaValues'.
                18,
                // @ts-expect-error Type '16' is not assignable to type 'AlphaValues'.
                16,
            ];
            expect(values).toBeDefined();
        });
        it('should be ok (strings)', () => {
            enum Alpha {
                A = 'A',
                C = 'C',
                F = 'F',
            }
            type AlphaValues = EnumValues<typeof Alpha>;
            const values: AlphaValues[] = [
                Alpha.A,
                Alpha.C,
                'A',
                'C',
                'F',
                // @ts-expect-error Type '"B"' is not assignable to type 'AlphaValues'.
                'B',
                // @ts-expect-error Type '"D"' is not assignable to type 'AlphaValues'.
                'D',
                'F',
                // @ts-expect-error Type '11' is not assignable to type 'AlphaValues'.
                11,
            ];
            expect(values).toBeDefined();
        });
    });
});
