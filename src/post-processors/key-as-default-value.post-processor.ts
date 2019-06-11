import { TranslationCollection } from '../utils/translation.collection';
import { PostProcessorInterface } from './post-processor.interface';

export class KeyAsDefaultValuePostProcessor implements PostProcessorInterface {

	public name: string = 'KeyAsDefaultValue';

	public process(working: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection {
		return working.map((key, val) => val === '' ? key : val);
	}

}
