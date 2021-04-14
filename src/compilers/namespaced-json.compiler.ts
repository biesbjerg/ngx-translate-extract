import { TranslationCollection } from '../utils/translation.collection';
import { stripBOM } from '../utils/utils';

import { flatten, unflatten } from 'flat';
import { CoreCompiler } from './core.compiler';

export class NamespacedJsonCompiler extends CoreCompiler {
	public indentation: string = '\t';

	public extension = 'json';

	public constructor(options?: any) {
		super(options);
		if (options && typeof options.indentation !== 'undefined') {
			this.indentation = options.indentation;
		}
	}

	protected compileSpecific(collection: TranslationCollection): string {
		const values: {} = unflatten(collection.values, {
			object: true
		});
		return JSON.stringify(values, null, this.indentation);
	}

	public parse(contents: string): TranslationCollection {
		const values: {} = flatten(JSON.parse(stripBOM(contents)));
		return new TranslationCollection(values);
	}
}
