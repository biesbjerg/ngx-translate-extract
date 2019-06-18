import { TranslationCollection } from '../utils/translation.collection';

export interface ParserInterface {

	extract(template: string, path: string): TranslationCollection;

}
