import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';

import * as flat from 'flat';
import sortObject from '../utils/deepObject.sort';
import { ExtractTaskOptionsInterface } from '..';

export class NamespacedJsonCompiler implements CompilerInterface {

	public indentation = '\t';

	public extension = 'json';

	public constructor(options?: any) {
		if (options && typeof options.indentation !== 'undefined') {
			this.indentation = options.indentation;
		}
	}

	public compile(collection: TranslationCollection, options: ExtractTaskOptionsInterface): string {
		let values: {} = flat.unflatten(collection.values, {
			object: true,
		});
		if (options.sort) {
			values = sortObject(values);
		}

		return JSON.stringify(values, null, this.indentation);
	}

	public parse(contents: string): TranslationCollection {
		const values: {} = flat.flatten(JSON.parse(contents));
		return new TranslationCollection(values);
	}

}
