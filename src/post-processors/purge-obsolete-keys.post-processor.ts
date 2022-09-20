import { TranslationCollection } from '../utils/translation.collection.js';
import { PostProcessorInterface } from './post-processor.interface.js';

export class PurgeObsoleteKeysPostProcessor implements PostProcessorInterface {
	public name: string = 'PurgeObsoleteKeys';

	public process(draft: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection {
		return draft.intersect(extracted);
	}
}
