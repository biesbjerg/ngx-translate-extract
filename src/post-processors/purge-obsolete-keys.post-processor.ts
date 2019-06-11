import { TranslationCollection } from '../utils/translation.collection';
import { PostProcessorInterface } from './post-processor.interface';

export class PurgeObsoleteKeysPostProcessor implements PostProcessorInterface {

	public name: string = 'PurgeObsoleteKeys';

	public process(working: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection {
		return working.intersect(extracted);
	}

}
