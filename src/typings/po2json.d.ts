declare module "po2json" {
    export interface Po2JsonOptions {
        fuzzy?: boolean;
        stringify?: boolean;
        pretty?: boolean;
        format?: 'raw' | 'jed' | 'jed1.x' | 'mf';
    }

    export function parse(buf: string | Buffer, options?: Po2JsonOptions)
    export function parseFile(fileName: string, options?: Po2JsonOptions, cb?: (err: string, jsonData: any) => void)
    export function parseFileSync(fileName: string, options?: Po2JsonOptions)
}