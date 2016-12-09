import { ParserInterface } from './parser.interface';
import { AbstractTemplateParser } from './abstract-template.parser';
import { StringCollection } from '../utils/string.collection';

export class PipeParser extends AbstractTemplateParser implements ParserInterface {

	public extract(contents: string, path?: string): StringCollection {
		if (path && this._isAngularComponent(path)) {
			contents = this._extractInlineTemplate(contents);
		}

		return this._parseTemplate(contents);
	}

	protected _parseTemplate(template: string): StringCollection {
		const collection = new StringCollection();

		const regExp = new RegExp(/([\'"`])([^\1\r\n]*)\1\s+\|\s*translate(:.*?)?/, 'g');

		let matches;
		while (matches = regExp.exec(template)) {
			collection.add(matches[2]);
		}

		return collection;
	}

}
