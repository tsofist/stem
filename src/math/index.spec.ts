import { add, divide, multiply, subtract } from '.';

describe('math', () => {
    it('add', () => {
        expect(add(0.1, 0.2)).toEqual(0.3);
    });

    it('subtract', () => {
        expect(subtract(0.3, 0.1)).toEqual(0.2);
    });

    it('multiply', () => {
        expect(multiply(0.1, 23)).toEqual(2.3);
    });

    it('divide', () => {
        expect(divide(11.2, 100)).toEqual(0.112);
    });
});
