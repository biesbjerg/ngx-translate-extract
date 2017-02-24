import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
export declare class ServiceParser implements ParserInterface {
    extract(contents: string, path?: string): TranslationCollection;
    protected _extractTranslateServiceVar(contents: string): string;
    protected _stringContainsArray(input: string): boolean;
    protected _stringToArray(input: string): string[];
}
