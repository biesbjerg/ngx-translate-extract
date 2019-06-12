import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils';

export class PipeParser implements ParserInterface {

	public extract(contents: string, path?: string): TranslationCollection {
		if (path && isPathAngularComponent(path)) {
			contents = extractComponentInlineTemplate(contents);
		}

		return this.parseTemplate(contents);
	}

	protected parseTemplate(template: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		const regExp: RegExp = /(['"`])((?:(?!\1).|\\\1)+)\1\s*\|\s*translate/g;
		let matches: RegExpExecArray;
		while (matches = regExp.exec(template)) {
			collection = collection.add(matches[2].split('\\\'').join('\''));
		}

		return collection;
	}

}
