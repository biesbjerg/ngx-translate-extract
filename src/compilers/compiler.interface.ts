import { TranslationCollection } from '../utils/translation.collection';
import { Options } from 'yargs-parser';

export interface CompilerInterface {

	config: Options;

	extension: string;

	selector: string;

	compile(collection: TranslationCollection): string;

	parse(contents: string): TranslationCollection;

}
