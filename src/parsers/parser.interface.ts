import { TranslationCollection } from '../utils/translation.collection';

export interface ParserInterface {
	extract(source: string, filePath: string): TranslationCollection | null;
}
