import { TranslationCollection } from '../utils/translation.collection';
import { PostProcessorInterface } from './post-processor.interface';

const MISSING_TRANSLATION = 'Missing translation';

export class CustomDefaultValuePostProcessor implements PostProcessorInterface {
	public name: string = 'CustomDefaultValue';
	private value: string;

	constructor(value: string) {
		this.value = value;
	}

	public process(draft: TranslationCollection): TranslationCollection {
		return draft.map((_, val) => (val ? val : this.value ? this.value : MISSING_TRANSLATION));
	}
}
