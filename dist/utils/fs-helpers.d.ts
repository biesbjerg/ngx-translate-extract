declare module 'braces' {
    interface Options {
        keepEscaping?: boolean;
    }
}
export declare function normalizeHomeDir(path: string): string;
export declare function expandPattern(pattern: string): string[];
export declare function normalizePaths(patterns: string[], defaultPatterns?: string[]): string[];
