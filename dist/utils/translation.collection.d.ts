export interface TranslationType {
    [key: string]: string;
}
export declare class TranslationCollection {
    values: TranslationType;
    constructor(values?: TranslationType);
    add(key: string, val?: string): TranslationCollection;
    addKeys(keys: string[]): TranslationCollection;
    remove(key: string): TranslationCollection;
    forEach(callback: (key?: string, val?: string) => void): TranslationCollection;
    filter(callback: (key?: string, val?: string) => boolean): TranslationCollection;
    union(collection: TranslationCollection): TranslationCollection;
    intersect(collection: TranslationCollection): TranslationCollection;
    has(key: string): boolean;
    get(key: string): string;
    keys(): string[];
    count(): number;
    isEmpty(): boolean;
    sort(compareFn?: (a: string, b: string) => number): TranslationCollection;
}
