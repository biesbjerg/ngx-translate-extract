import { TranslationCollection } from '../utils/translation.collection';
import { PostProcessorInterface } from './post-processor.interface';

export class SortByKeyPostProcessor implements PostProcessorInterface {

	public name: string = 'SortByKey';

	public process(working: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection {
		return working.sort();
	}

}
