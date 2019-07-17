import { TranslationCollection } from '../utils/translation.collection';

export interface PostProcessorInterface {

	name: string;

	process(draft: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection;

}
