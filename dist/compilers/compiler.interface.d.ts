import { TranslationCollection } from '../utils/translation.collection';
export interface CompilerInterface {
    compile(collection: TranslationCollection): string;
    parse(contents: string): TranslationCollection;
}
