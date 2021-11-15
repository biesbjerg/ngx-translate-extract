import { TranslationCollection } from '../utils/translation.collection.js';
export interface ParserInterface {
    extract(source: string, filePath: string): TranslationCollection | null;
}
