import { TranslationCollection } from '../utils/translation.collection.js';
export interface PostProcessorInterface {
    name: string;
    process(draft: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection;
}
