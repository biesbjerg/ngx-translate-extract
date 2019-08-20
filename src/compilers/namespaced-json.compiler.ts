import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { stripBOM } from '../utils/utils';

import { flatten, unflatten } from 'flat';
import { injectable } from 'inversify';
import { AbstractCompiler } from './abstract-compiler';

@injectable()
export class NamespacedJsonCompiler extends AbstractCompiler implements CompilerInterface {

	public extension = 'json';
	public selector = 'namespaced-json';

	public constructor() {
		super();
	}

	public compile(collection: TranslationCollection): string {
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
