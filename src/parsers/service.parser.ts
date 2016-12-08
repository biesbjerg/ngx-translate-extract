import { ParserInterface } from './parser.interface';

export class ServiceParser implements ParserInterface {

	public process(filePath: string, contents: string): string[] {
		let results: string[] = [];

		const translateServiceVar = this._extractTranslateServiceVar(contents);
		if (!translateServiceVar) {
			return results;
		}

		const methodRegExp: RegExp = new RegExp(/(?:get|instant)\s*\(\s*(\[?([\'"`])([^\1\r\n]+)\2\]?)/);
		const regExp: RegExp = new RegExp(`${translateServiceVar}\.${methodRegExp.source}`, 'g');

		let matches;
		while (matches = regExp.exec(contents)) {
			if (this._stringContainsArray(matches[1])) {
				results.push(...this._stringToArray(matches[1]));
			} else {
				results.push(matches[3]);
			}
		}

		return results;
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
