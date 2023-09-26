export function capitalize(input: string): string {
    input = input == null ? '' : String(input);
    return input.length >= 1 ? input.charAt(0).toUpperCase() + input.substring(1) : input;
}
