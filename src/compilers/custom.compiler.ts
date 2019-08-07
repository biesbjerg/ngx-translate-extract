
import { TranslationCollection } from '../utils/translation.collection';
import { injectable } from 'inversify';
import { CompilerInterface } from './compiler.interface';
import { AbstractCompiler } from './abstract-compiler';

@injectable()
export class CustomCompiler extends AbstractCompiler implements CompilerInterface {

	public extension: string = 'xml';
	public selector: string = 'custom';
	constructor () {
		super();
	}

	public compile(collection: TranslationCollection): string {
		throw new Error('not implemented');
	}

	public parse(contents: string): TranslationCollection {
		throw new Error('not implemented');
	}

}
