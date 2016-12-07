import { ParserInterface } from './parser.interface';

export class ServiceParser implements ParserInterface {

	public process(filePath: string, contents: string): string[] {
		let results: string[] = [];

		const translateServiceVar = this._extractTranslateServiceVar(contents);
		if (!translateServiceVar) {
			return results;
		}

		const methodPattern: string = '(?:get|instant)\\s*\\\(\\s*([\'"`])([^\\1\\r\\n]+)\\1';
		const regExp: RegExp = new RegExp(`${translateServiceVar}\.${methodPattern}`, 'g');

		let matches;
		while (matches = regExp.exec(contents)) {
			results.push(matches[2]);
		}

		return results;
	}

	/**
	 * Extract name of TranslateService variable for use in patterns
	 */
	protected _extractTranslateServiceVar(contents: string): string {
		const matches = contents.match(/([a-z0-9_]+)\s*:\s*TranslateService/i);
		if (matches === null) {
			return '';
		}

		return matches[1];
	}

}
