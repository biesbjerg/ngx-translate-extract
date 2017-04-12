import { TranslationCollection } from '../utils/translation.collection';
export interface CompilerInterface {
    extension: string;
    compile(collection: TranslationCollection): string;
    parse(contents: string): TranslationCollection;
}
