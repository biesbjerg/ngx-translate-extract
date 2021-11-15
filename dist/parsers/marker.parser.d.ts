import { ParserInterface } from './parser.interface.js';
import { TranslationCollection } from '../utils/translation.collection.js';
export declare class MarkerParser implements ParserInterface {
    extract(source: string, filePath: string): TranslationCollection | null;
}
