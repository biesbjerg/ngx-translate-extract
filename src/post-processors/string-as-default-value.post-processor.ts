import { TranslationCollection } from '../utils/translation.collection.js';
import { PostProcessorInterface } from './post-processor.interface.js';

interface Options {
	defaultValue: string;
}

export class StringAsDefaultValuePostProcessor implements PostProcessorInterface {
	public name: string = 'StringAsDefaultValue';

	public constructor(protected options: Options) {}

	public process(draft: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection {
		return draft.map((key, val) => (existing.get(key) === undefined ? this.options.defaultValue : val));
	}
}
