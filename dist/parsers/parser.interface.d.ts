import { TranslationCollection } from '../utils/translation.collection';
export interface ParserInterface {
    extract(contents: string, path?: string): TranslationCollection;
}
