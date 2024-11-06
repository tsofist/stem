import { chunk } from './chunk';

describe('chunk function', () => {
    const inputString: string = 'Hello, world!';
    const inputArray = [1, 2, 3, 4, 5];

    it('returns false if target is null', async () => {
        const result = await chunk(null, 3);

        expect(result).toBe(false);
    });

    it('returns false if size is 0', async () => {
        const result = await chunk(inputString, 0);

        expect(result).toBe(false);
    });

    it('returns true if target is chunkable and onChunk is not provided', async () => {
        const result = await chunk(inputString, 3);

        expect(result).toBe(true);
    });

    it('calls onChunk for each chunk if provided', async () => {
        const chunks: (string | number[])[] = [];
        const result = await chunk<number>(inputArray, 2, (chunk) => {
            chunks.push(chunk);
        });

        expect(result).toBe(true);
        expect(chunks).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('returns true if onChunk returns false for first chunk', async () => {
        const result = await chunk(inputString, 3, (chunk) => chunk !== 'Hel');

        expect(result).toBe(true);
    });

    it('returns true if onChunk returns false for a later chunk', async () => {
        const result = await chunk(inputString, 3, (chunk) => chunk !== 'wor');

        expect(result).toBe(true);
    });

    it('returns true if target is an array and is chunkable', async () => {
        const result = await chunk<number>(inputArray, 2);

        expect(result).toBe(true);
    });
});
