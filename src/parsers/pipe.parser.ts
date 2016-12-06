import { ParserInterface } from './parser.interface';

export class PipeParser implements ParserInterface {

	public patterns = {
		pipe: `(['"\`])([^\\1\\r\\n]*)\\1\\s+\\|\\s*translate(:.*?)?`
	};

	public process(contents: string): string[] {
		let results: string[] = [];

		for (let patternName in this.patterns) {
			const regExp = new RegExp(this.patterns[patternName], 'g');

			let matches;
			while (matches = regExp.exec(contents)) {
				results.push(matches[2]);
			}
		}

		return results;
	}

}
