import { TranslationCollection } from '../utils/translation.collection';

export interface PostProcessorInterface {

	name: string;

	process(working: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection;

}
