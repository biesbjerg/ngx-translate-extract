import { ParserInterface } from './parser.interface';
import { StringCollection } from '../utils/string.collection';

export class ServiceParser implements ParserInterface {

	public extract(contents: string, path?: string): StringCollection {
		const collection = new StringCollection();

		const translateServiceVar = this._extractTranslateServiceVar(contents);
		if (!translateServiceVar) {
			return collection;
		}

		const methodRegExp: RegExp = new RegExp(/(?:get|instant)\s*\(\s*(\[?([\'"`])([^\1\r\n]+)\2\]?)/);
		const regExp: RegExp = new RegExp(`${translateServiceVar}\.${methodRegExp.source}`, 'g');

		let matches;
		while (matches = regExp.exec(contents)) {
			if (this._stringContainsArray(matches[1])) {
				collection.add(this._stringToArray(matches[1]));
			} else {
				collection.add(matches[3]);
			}
		}

		return collection;
	}

	/**
	 * Checks if string contains an array
	 */
	protected _stringContainsArray(input: string): boolean {
		return input.startsWith('[') && input.endsWith(']');
	}

	/**
	 * Converts string to array
	 */
	protected _stringToArray(input: string): string[] {
		if (this._stringContainsArray(input)) {
			return eval(input);
		}

		return [];
	}

	/**
	 * Extracts name of TranslateService variable for use in patterns
	 */
	protected _extractTranslateServiceVar(contents: string): string {
		const matches = contents.match(/([a-z0-9_]+)\s*:\s*TranslateService/i);
		if (matches === null) {
			return '';
		}

		return matches[1];
	}

}
