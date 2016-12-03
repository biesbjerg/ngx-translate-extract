import { ParserInterface } from './parser.interface';

export class HtmlParser implements ParserInterface {

	public patterns = {
		PipeSingleQuote: '\'((?:\\\\.|[^\'\\\\])*)\'\\s*\\|\\s*translate(:.*?)?',
		PipeDoubleQuote: '"((?:\\\\.|[^"\\\\])*)"\\s*\\|\\s*translate(:.*?)?'
	}

	public process(contents: string): string[] {
		let results: string[] = [];

		for (let patternName in this.patterns) {
			const regExp = new RegExp(this.patterns[patternName], 'g');

			let matches;
			while (matches = regExp.exec(contents)) {
				results.push(matches[1]);
			}
		}

		return results;
	}

}
