import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { stripBOM } from '../utils/utils';

import { flatten, unflatten } from 'flat';

export class NamespacedJsonCompiler implements CompilerInterface {
	public indentation: string = '\t';
	public newlineAtEndOfFile = false;

	public extension = 'json';

	public constructor(options?: any) {
		if (!options) {
			return; // no options
		}
		if (typeof options.indentation !== 'undefined') {
			this.indentation = options.indentation;
		}
		if (typeof options.newlineAtEndOfFile !== 'undefined') {
			this.newlineAtEndOfFile = options.newlineAtEndOfFile;
		}
	}

	public compile(collection: TranslationCollection): string {
		const values: {} = unflatten(collection.values, {
			object: true
		});
		let json = JSON.stringify(values, null, this.indentation);
		if (this.newlineAtEndOfFile) {
			json += '\n';
		}
		return json;
	}

	public parse(contents: string): TranslationCollection {
		const values: {} = flatten(JSON.parse(stripBOM(contents)));
		return new TranslationCollection(values);
	}
}
