import { createSaltedStringHash, PicklesHashingAlgorithm, verifySaltedHash } from './pickles.js';

describe('pickles', () => {
    const values = ['Hello!', '안녕!🇰🇷', 'Привет!🚩'];

    it('verifySaltedHash.HMACSha256', () => {
        for (const value of values) {
            const h = createSaltedStringHash(value, PicklesHashingAlgorithm.HMACSha256);
            expect(verifySaltedHash(h, value)).toStrictEqual(true);
        }
    });
    it('verifySaltedHash.HMACSha512', () => {
        for (const value of values) {
            const h = createSaltedStringHash(value, PicklesHashingAlgorithm.HMACSha512);
            expect(verifySaltedHash(h, value)).toStrictEqual(true);
        }
    });
});
