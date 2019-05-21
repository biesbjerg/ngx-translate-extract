import { TranslationCollection } from '../utils/translation.collection';
import { ExtractTaskOptionsInterface } from '../cli/tasks/extract.task';

export interface CompilerInterface {

	extension: string;

	compile(collection: TranslationCollection, options: ExtractTaskOptionsInterface): string;

	parse(contents: string, options: ExtractTaskOptionsInterface): TranslationCollection;

}
