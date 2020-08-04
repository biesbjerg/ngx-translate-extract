import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';

export abstract class CoreCompiler implements CompilerInterface {
	public abstract extension: string;
	public eofNewline = false;

	protected constructor(options?: any) {
		if (options && typeof options.eofNewline !== 'undefined') {
			this.eofNewline = options.eofNewline;
		}
	}

	public compile(collection: TranslationCollection): string {
		return this.compileSpecific(collection) + (this.eofNewline ? '\n' : '');
	}

	protected abstract compileSpecific(collection: TranslationCollection): string;

	public abstract parse(contents: string): TranslationCollection;
}
