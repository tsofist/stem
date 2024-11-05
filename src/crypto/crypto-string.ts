import { Buffer } from 'buffer';
import { BinaryLike, CipherKey, createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { raise } from '../error';
import { Base64String, Rec } from '../index';
import { valueIn } from '../value-in';

/**
 * Supported cipher algorithms.
 *
 * @example
 *   openssl list -cipher-algorithms
 */
export enum CipherAlgorithm {
    ChaCha20 = 'chacha20',
    ChaCha20Poly1305 = 'chacha20-poly1305',
    AES256CBC = 'aes-256-cbc',
    AES256GCM = 'aes-256-gcm',
}

/**
 * Functionality for encrypting strings.
 * Suitable for storing sensitive data in a database, such as passwords.
 */
export class CryptoString {
    static createCryptoKey(): Base64String {
        return randomBytes(32).toString('base64');
    }

    readonly #cryptoKey: CipherKey;
    readonly #cipherAlgorithm: CipherAlgorithm;
    readonly #ivLen: IVSizeValue;
    readonly #authTagLen: number;

    /**
     * @see CryptoString.createCryptoKey
     *
     * @example
     *   const key = CryptoString.createCryptoKey();
     *
     * @example
     *   openssl rand -base64 32
     */
    constructor(cryptoKey: Base64String, algorithm: CipherAlgorithm = CipherAlgorithm.ChaCha20) {
        if (!valueIn(algorithm, CipherAlgorithm, true)) {
            raise(`Unknown cipher algorithm: ${algorithm}`);
        }
        if (!cryptoKey || cryptoKey.length !== 44) {
            raise(
                'Crypto key must be non-empty base64-encoded string of 32 bytes (44 ch.).' +
                    'Use CryptoString.createCryptoKey() to generate a new key.' +
                    'Or use command: openssl rand -base64 32',
            );
        }
        this.#cryptoKey = Buffer.from(cryptoKey, 'base64');
        this.#cipherAlgorithm = algorithm;
        this.#ivLen = IVSize[algorithm];
        this.#authTagLen = ATSize[algorithm];
    }

    encrypt(value: BinaryLike): Base64String {
        const iv = randomBytes(this.#ivLen);
        const cipher = createCipheriv(this.#cipherAlgorithm, this.#cryptoKey, iv, {
            // @ts-expect-error It's OK
            authTagLength: this.#authTagLen,
        });

        const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
        const authTag = this.#authTagLen ? cipher.getAuthTag() : Buffer.alloc(0);

        return Buffer.concat([iv, authTag, encrypted]).toString('base64');
    }

    decrypt(value: string): Base64String {
        const data = Buffer.from(value, 'base64');
        const iv = data.subarray(0, this.#ivLen);

        const authTag = this.#authTagLen
            ? data.subarray(this.#ivLen, this.#ivLen + this.#authTagLen)
            : Buffer.alloc(0);
        const encrypted = this.#authTagLen
            ? data.subarray(this.#ivLen + this.#authTagLen)
            : data.subarray(this.#ivLen);

        const decipher = createDecipheriv(this.#cipherAlgorithm, this.#cryptoKey, iv, {
            // @ts-expect-error It's OK
            authTagLength: this.#authTagLen,
        });

        if (this.#authTagLen > 0) {
            decipher.setAuthTag(authTag);
        }

        return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
    }
}

type IVSizeValue = (typeof IVSize)[CipherAlgorithm];

const IVSize = {
    [CipherAlgorithm.ChaCha20]: 16,
    [CipherAlgorithm.AES256CBC]: 16,
    [CipherAlgorithm.ChaCha20Poly1305]: 12,
    [CipherAlgorithm.AES256GCM]: 12,
} as const satisfies Rec<number, CipherAlgorithm>;

const ATSize = {
    [CipherAlgorithm.ChaCha20]: 0,
    [CipherAlgorithm.AES256CBC]: 0,
    [CipherAlgorithm.ChaCha20Poly1305]: 16,
    [CipherAlgorithm.AES256GCM]: 16,
} as const satisfies Rec<number, CipherAlgorithm>;
