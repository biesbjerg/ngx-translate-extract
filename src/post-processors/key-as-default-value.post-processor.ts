import { TranslationCollection } from '../utils/translation.collection';
import { PostProcessorInterface } from './post-processor.interface';

export class KeyAsDefaultValuePostProcessor implements PostProcessorInterface {

	public name: string = 'KeyAsDefaultValue';

	public process(draft: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection {
		return draft.map((key, val) => val === '' ? key : val);
	}

}
