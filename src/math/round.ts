export function roundTo(val: number, fractionDigits = 2): number {
    const fd = Math.pow(10, fractionDigits);
    return Math.round(val * fd) / fd;
}
