export interface Deferred<T> {
    readonly promise: Promise<T>;
    resolver: (val: T) => void;
    rejector: (error: Error) => void;
}

export function deferred<T = void>(): Deferred<T> {
    let resolver!: (val: T) => void;
    let rejector!: (error: Error) => void;

    const promise = new Promise<T>((resolve, reject) => {
        resolver = resolve;
        rejector = reject;
    });

    return {
        promise,
        resolver,
        rejector,
    };
}
