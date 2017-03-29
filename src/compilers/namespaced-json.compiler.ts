import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';

import * as flat from 'flat';

export class NamespacedJsonCompiler implements CompilerInterface {

	public extension = 'json';

	public compile(collection: TranslationCollection): string {
		const values: {} = flat.unflatten(collection.values, {
			object: true
		});
		return JSON.stringify(values, null, '\t');
	}

	public parse(contents: string): TranslationCollection {
		const values: {} = flat.flatten(JSON.parse(contents));
		return new TranslationCollection(values);
	}

}
