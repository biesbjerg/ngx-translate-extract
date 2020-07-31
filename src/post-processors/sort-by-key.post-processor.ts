import { TranslationCollection } from '../utils/translation.collection';
import { PostProcessorInterface } from './post-processor.interface';

export type SortOptions = '' | 'case-insensitive';

export class SortByKeyPostProcessor implements PostProcessorInterface {
	public name: string = 'SortByKey';

	constructor(private sortOptions: SortOptions) { }

	public process(draft: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection {
		if (this.sortOptions === 'case-insensitive') {
			return draft.sort((a, b) => {
				return a.toLowerCase().localeCompare(b.toLowerCase());
			});
		} else {
			return draft.sort();
		}
	}
}

