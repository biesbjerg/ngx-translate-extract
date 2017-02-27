import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';

export class JsonCompiler implements CompilerInterface {

	public compile(collection: TranslationCollection): string {
		return JSON.stringify(collection.values, null, '\t');
	}

	public parse(contents: string): TranslationCollection {
		contents = contents || '{}';
		return new TranslationCollection(JSON.parse(contents));
	}

}
