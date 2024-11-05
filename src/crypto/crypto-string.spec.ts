import { enumKeyByValue, extractEnumValues } from '../enum';
import { CipherAlgorithm, CryptoString } from './crypto-string';

describe('CryptoString', () => {
    const cryptoKey = CryptoString.createCryptoKey();
    const testValue = '§ Hello, World! 요 😊';

    describe('Encode+Decode', () => {
        for (const algorithm of [
            /* All     */ ...extractEnumValues(CipherAlgorithm),
            /* Default */ undefined,
        ]) {
            const algorithmName = algorithm
                ? enumKeyByValue(CipherAlgorithm, algorithm)
                : '[ Default algorithm ]';

            it(`should encrypt and decrypt a value correctly with ${algorithmName}`, () => {
                const cryptoString = new CryptoString(cryptoKey, algorithm);

                const encrypted = cryptoString.encrypt(testValue);
                expect(encrypted.trim()).not.toStrictEqual('');

                const decrypted = cryptoString.decrypt(encrypted);
                expect(decrypted).toStrictEqual(testValue);
            });
        }
    });

    it('should encrypt and decrypt an empty value correctly', () => {
        const cryptoString = new CryptoString(cryptoKey);
        const value = '';

        const encrypted = cryptoString.encrypt(value);
        expect(encrypted.trim()).not.toStrictEqual('');

        const decrypted = cryptoString.decrypt(encrypted);
        expect(decrypted).toStrictEqual(value);
    });

    it('should throw an error if the crypto key is empty', () => {
        expect(() => new CryptoString('')).toThrow(new RegExp('^Crypto key must be non-empty'));
    });
});
