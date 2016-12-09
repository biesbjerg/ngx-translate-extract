import { StringCollection } from '../utils/string.collection';

export interface ParserInterface {

	extract(contents: string, path?: string): StringCollection;

}
