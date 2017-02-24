import { ParserInterface } from '../parsers/parser.interface';
import { TranslationCollection } from './translation.collection';
export declare class Extractor {
    parsers: ParserInterface[];
    patterns: string[];
    constructor(parsers: ParserInterface[], patterns: string[]);
    process(dir: string): TranslationCollection;
    protected _readDir(dir: string, patterns: string[]): string[];
}
