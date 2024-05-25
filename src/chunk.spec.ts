import { chunk } from './chunk.js';

describe('chunk function', () => {
    const inputString = 'Hello, world!';
    const inputArray = [1, 2, 3, 4, 5];

    it('returns false if target is null', async () => {
        const result = await chunk<string>(null, 3);

        expect(result).toBe(false);
    });

    it('returns false if size is 0', async () => {
        const result = await chunk<string>(inputString, 0);

        expect(result).toBe(false);
    });

    it('returns true if target is chunkable and onChunk is not provided', async () => {
        const result = await chunk<string>(inputString, 3);

        expect(result).toBe(true);
    });

    it('calls onChunk for each chunk if provided', async () => {
        const chunks: (string | number[])[] = [];
        const result = await chunk<number, number[]>(inputArray, 2, async (chunk) => {
            chunks.push(chunk);
        });

        expect(result).toBe(true);
        expect(chunks).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('returns true if onChunk returns false for first chunk', async () => {
        const result = await chunk<string>(inputString, 3, async (chunk) => chunk !== 'Hel');

        expect(result).toBe(true);
    });

    it('returns true if onChunk returns false for a later chunk', async () => {
        const result = await chunk<string>(inputString, 3, async (chunk) => chunk !== 'wor');

        expect(result).toBe(true);
    });

    it('returns true if target is an array and is chunkable', async () => {
        const result = await chunk<number, number[]>(inputArray, 2);

        expect(result).toBe(true);
    });
});
