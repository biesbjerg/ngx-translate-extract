import { TranslationCollection } from '../utils/translation.collection.js';
import { PostProcessorInterface } from './post-processor.interface.js';
interface Options {
    defaultValue: string;
}
export declare class StringAsDefaultValuePostProcessor implements PostProcessorInterface {
    protected options: Options;
    name: string;
    constructor(options: Options);
    process(draft: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection;
}
export {};
