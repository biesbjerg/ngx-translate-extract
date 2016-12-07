import { ParserInterface } from './parser.interface';

export class ServiceParser implements ParserInterface {

	public patterns = {
		translateServiceMethods: `{{TRANSLATE_SERVICE}}\.(?:get|instant)\\s*\\\(\\s*(['"\`])([^\\1\\r\\n]+)\\1`,
	};

	public process(contents: string): string[] {
		let results: string[] = [];

		const translateServiceVar = this._extractTranslateServiceVar(contents);
		if (!translateServiceVar) {
			return [];
		}

		for (let patternName in this.patterns) {
			const regExp = this._createRegExp(patternName, {
				'TRANSLATE_SERVICE': translateServiceVar
			});

			let matches;
			while (matches = regExp.exec(contents)) {
				results.push(matches[2]);
			}
		}

		return results;
	}

	/**
	 * Create regular expression, replacing placeholders with real values
	 */
	protected _createRegExp(patternName: string, replaceVars: {} = {}): RegExp {
		if (!this.patterns.hasOwnProperty(patternName)) {
			throw new Error('Invalid pattern name');
		}

		let pattern = this.patterns[patternName];
		Object.keys(replaceVars).forEach(key => {
			pattern = pattern.replace('{{' + key + '}}', replaceVars[key]);
		});

		return new RegExp(pattern, 'g');
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
