import { TranslationCollection } from '../utils/translation.collection.js';
import { PostProcessorInterface } from './post-processor.interface.js';
export declare class KeyAsDefaultValuePostProcessor implements PostProcessorInterface {
    name: string;
    process(draft: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection;
}
