import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { stripBOM } from '../utils/utils';

import { flatten } from 'flat';

export class JsonCompiler implements CompilerInterface {
	public indentation: string = '\t';

	public extension: string = 'json';

	public constructor(options?: any) {
		if (options && typeof options.indentation !== 'undefined') {
			this.indentation = options.indentation;
		}
	}

	public compile(collection: TranslationCollection): string {
		return JSON.stringify(collection.values, null, this.indentation);
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
