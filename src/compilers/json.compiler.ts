import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { stripBOM } from '../utils/utils';

import { flatten } from 'flat';

export class JsonCompiler implements CompilerInterface {
	public indentation: string = '\t';
	public newlineAtEndOfFile = false;

	public extension: string = 'json';

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
		let json = JSON.stringify(collection.values, null, this.indentation);
		if (this.newlineAtEndOfFile) {
			json += '\n';
		}
		return json;
	}

	public parse(contents: string): TranslationCollection {
		let values: any = JSON.parse(stripBOM(contents));
		if (this.isNamespacedJsonFormat(values)) {
			values = flatten(values);
		}
		return new TranslationCollection(values);
	}

	protected isNamespacedJsonFormat(values: any): boolean {
		return Object.keys(values).some(key => typeof values[key] === 'object');
	}
}
