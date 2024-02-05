/**
 * @example
 *   0.1 + 0.2     // 0.30000000000000004
 *   add(0.1, 0.2) // 0.3
 *
 * @see https://floating-point-gui.de/
 */
export function add(...numbers: number[]): number {
    const factor = calcFactor(numbers);
    return numbers.reduce((x, y) => x + factor * y, 0) / factor;
}

/**
 * @example
 *   0.3 - 0.1          // 0.19999999999999998
 *   subtract(0.3, 0.1) // 0.2
 *
 * @see https://floating-point-gui.de/
 */
export function subtract(l: number, r: number): number {
    const factor = calcFactor([l, r]);
    return (l * factor - r * factor) / factor;
}

/**
 * @example
 *   0.1 * 23          // 2.3000000000000003
 *   multiply(0.1, 23) // 2.3
 *
 * @see https://floating-point-gui.de/
 */
export function multiply(...numbers: number[]): number {
    const factor = calcFactor(numbers);
    const factor10 = factor * 10;
    return (
        Math.round(
            numbers.reduce((x, y) => (x * factor * (y * factor)) / (factor * factor), 1) * factor10,
        ) / factor10
    );
}

/**
 * @example
 *   11.2 / 100        // 0.11199999999999999
 *   divide(11.2, 100) // 0.112
 * @see https://floating-point-gui.de/
 */
export function divide(l: number, r: number): number {
    const factor = calcFactor([l, r]);
    return (l * factor) / (r * factor);
}

function calcFactor(numbers: number[]) {
    const factors = [];
    for (const value of numbers) {
        const parts = value.toString().split('.');
        factors.push(parts.length < 2 ? 1 : Math.pow(10, parts[1].length));
    }
    return Math.max.apply(null, factors);
}
