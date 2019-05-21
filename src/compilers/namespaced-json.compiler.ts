import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';

import * as flat from 'flat';

export class NamespacedJsonCompiler implements CompilerInterface {

	public indentation: string = '\t';

	public extension = 'json';

	public constructor(options?: any) {
		if (options && typeof options.indentation !== 'undefined') {
			this.indentation = options.indentation;
		}
	}

	public compile(collection: TranslationCollection): string {
		const values: {} = flat.unflatten(collection.values, {
			object: true,
		});
		return JSON.stringify(values, null, this.indentation);
	}

	public parse(contents: string): TranslationCollection {
		const values: {} = flat.flatten(JSON.parse(contents));
		return new TranslationCollection(values);
	}

}
