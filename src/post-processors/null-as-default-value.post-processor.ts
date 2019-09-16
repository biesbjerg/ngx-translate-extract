import { TranslationCollection } from '../utils/translation.collection';
import { PostProcessorInterface } from './post-processor.interface';

export class NullAsDefaultValuePostProcessor implements PostProcessorInterface {

	public name: string = 'NullAsDefaultValue';

	public process(draft: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection {
		return draft.map((key, val) => existing.get(key) === undefined ? null : val);
	}

}
