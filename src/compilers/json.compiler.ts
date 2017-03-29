import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';

export class JsonCompiler implements CompilerInterface {

	public indentation: string = '\t';

	public extension = 'json';

	public constructor(options?: any) {
		if (options && typeof options.indentation !== 'undefined') {
			this.indentation = options.indentation;
		}
	}

	public compile(collection: TranslationCollection): string {
		return JSON.stringify(collection.values, null, this.indentation);
	}

	public parse(contents: string): TranslationCollection {
		return new TranslationCollection(JSON.parse(contents));
	}

}
