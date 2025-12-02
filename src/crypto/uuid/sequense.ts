import { getRandomValues, randomFillSync } from 'crypto';
import { raise } from '../../error';
import type { UUIDB } from './types';

/**
 * Time ordered UUID v7 sequence generator.
 * @see https://www.ietf.org/archive/id/draft-ietf-uuidrev-rfc4122bis-00.html#name-uuid-version-7
 */
export class UUIDV7Sequence {
    /**
     * Generate next UUID v7 bytes
     */
    next() {
        const randoms = nextRandoms(this.#randomsState);
        this.update(randoms);
        return this.nextBytes(randoms);
    }

    protected update(randoms: Uint8Array, now = Date.now()) {
        const state = this.#state;

        state.time ??= -Infinity;
        state.seq ??= 0;

        if (now > state.time) {
            // new
            state.seq = (randoms[6] << 23) | (randoms[7] << 16) | (randoms[8] << 8) | randoms[9];
            state.time = now;
        } else {
            // bump seq
            state.seq = (state.seq + 1) | 0;
            // preserve monotonicity
            if (state.seq === 0) {
                state.time++;
            }
        }

        return this;
    }

    protected nextBytes(randoms: Uint8Array): UUIDB {
        const buf = new Uint8Array(16) as UUIDB;
        let offset = 0;
        let { time, seq } = this.#state;

        if (randoms.length < 16) {
            throw new Error('Random bytes length must be >= 16');
        }

        if (offset < 0 || offset + 16 > buf.length) {
            throw new RangeError(
                `UUID byte range ${offset}:${offset + 15} is out of buffer bounds`,
            );
        }

        // defaults
        time ??= Date.now();
        seq ??= ((randoms[6] * 0x7f) << 24) | (randoms[7] << 16) | (randoms[8] << 8) | randoms[9];

        // byte 0-5: timestamp (48 bits)
        buf[offset++] = (time / 0x10000000000) & 0xff;
        buf[offset++] = (time / 0x100000000) & 0xff;
        buf[offset++] = (time / 0x1000000) & 0xff;
        buf[offset++] = (time / 0x10000) & 0xff;
        buf[offset++] = (time / 0x100) & 0xff;
        buf[offset++] = time & 0xff;

        // byte 6: `version` (4 bits) | sequence bits 28-31 (4 bits)
        buf[offset++] = 0x70 | ((seq >>> 28) & 0x0f);

        // byte 7: sequence bits 20-27 (8 bits)
        buf[offset++] = (seq >>> 20) & 0xff;

        // byte 8: `variant` (2 bits) | sequence bits 14-19 (6 bits)
        buf[offset++] = 0x80 | ((seq >>> 14) & 0x3f);

        // byte 9: sequence bits 6-13 (8 bits)
        buf[offset++] = (seq >>> 6) & 0xff;

        // byte 10: sequence bits 0-5 (6 bits) | random (2 bits)
        buf[offset++] = ((seq << 2) & 0xff) | (randoms[10] & 0x03);

        // bytes 11-15: random (40 bits)
        buf[offset++] = randoms[11];
        buf[offset++] = randoms[12];
        buf[offset++] = randoms[13];
        buf[offset++] = randoms[14];
        buf[offset++] = randoms[15];

        return buf;
    }

    readonly #state: SequenceState = {};
    readonly #randomsState: RandomsState = createRandomsState();
}

function createRandomsState(): RandomsState {
    const buf = new Uint8Array(16);
    const pool = new Uint8Array(256);
    return { buf, pool, poolPos: pool.length };
}

function nextRandoms(state: RandomsState): Uint8Array {
    if (randomFillSync) {
        if (state.poolPos > state.pool.length - 16) {
            randomFillSync(state.pool);
            state.poolPos = 0;
        }
        return state.pool.slice(state.poolPos, (state.poolPos += 16));
    } else {
        return getRandomValues
            ? getRandomValues(state.buf)
            : crypto.getRandomValues
              ? crypto.getRandomValues(state.buf)
              : raise(`Unable to access secure random number generator (crypto.getRandomValues)`);
    }
}

type RandomsState = {
    /** Reusable buffer for values */
    readonly buf: Uint8Array;
    /** Pool of random values */
    readonly pool: Uint8Array;
    /** Current position in the pool */
    poolPos: number;
};

type SequenceState = {
    /** Milliseconds timestamp */
    time?: number;
    /** Sequence pointer */
    seq?: number;
};
