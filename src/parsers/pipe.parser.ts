import { ParserInterface } from './parser.interface';
import { AbstractTemplateParser } from './abstract-template.parser';

export class PipeParser extends AbstractTemplateParser implements ParserInterface {

	public process(filePath: string, contents: string): string[] {
		if (this._isAngularComponent(filePath)) {
			contents = this._extractInlineTemplate(contents);
		}

		return this._parseTemplate(contents);
	}

	protected _parseTemplate(template: string): string[] {
		let results: string[] = [];

		const regExp = new RegExp(/([\'"`])([^\1\r\n]*)\1\s+\|\s*translate(:.*?)?/, 'g');

		let matches;
		while (matches = regExp.exec(template)) {
			results.push(matches[2]);
		}

		return results;
	}

}
