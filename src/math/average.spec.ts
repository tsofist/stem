import { average } from './average.js';

describe('average', () => {
    it('should return 0 for an empty array', () => {
        expect(average([])).toBe(0);
    });

    it('should return the average of a single value', () => {
        expect(average([5])).toBe(5);
    });

    it('should return the average of an array of numbers', () => {
        expect(average([1, 2, 3, 4, 5])).toBe(3);
    });

    it('should return the average of an array of objects with a number property', () => {
        const values = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }];
        expect(average(values, (v) => v.value)).toBe(3);
    });

    it('should return the average of an array of objects with a string property', () => {
        const values = [
            { value: '1' },
            { value: '2' },
            { value: '3' },
            { value: '4' },
            { value: '5' },
        ];
        expect(average(values, (v) => parseInt(v.value, 10))).toBe(3);
    });

    it('should return NaN for an array of non-numeric values', () => {
        const values = ['a', 'b', 'c', 'd', 'e'];
        expect(average(values)).toBeNaN();
    });
});
