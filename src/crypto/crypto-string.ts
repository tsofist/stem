import { Buffer } from 'node:buffer';
import { BinaryLike, createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { raise } from '../error.js';
import { NonEmptyString } from '../index.js';

const CIPHER_ALGORITHM = 'aes-256-cbc';

export class CryptoString {
    readonly #cryptoKey: Buffer;
    /**
     * @example
     *   openssl rand -base64 32
     */
    constructor(cryptoKey: NonEmptyString) {
        if (!cryptoKey) raise('Crypto key must be non-empty base64 string (use openssl rand)');
        this.#cryptoKey = Buffer.from(cryptoKey, 'base64');
    }

    encrypt(value: BinaryLike): string {
        const iv = randomBytes(16);
        const cipher = createCipheriv(CIPHER_ALGORITHM, this.#cryptoKey, iv);

        return Buffer.concat([iv, cipher.update(value), cipher.final()]).toString('base64');
    }

    decrypt(value: string): string {
        const data = Buffer.from(value, 'base64');
        const decipher = createDecipheriv(CIPHER_ALGORITHM, this.#cryptoKey, data.slice(0, 16));

        return Buffer.concat([decipher.update(data.slice(16)), decipher.final()]).toString();
    }
}
