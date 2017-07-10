import { AbstractTemplateParser } from './abstract-template.parser';
import { TranslationCollection } from '../utils/translation.collection';

export class PipeParser extends AbstractTemplateParser {

	protected _parseTemplate(template: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		const regExp: RegExp = /(['"`])((?:(?!\1).|\\\1)+)\1\s*\|\s*translate/g;
		let matches: RegExpExecArray;
		while (matches = regExp.exec(template)) {
			collection = collection.add(matches[2].split('\\\'').join('\''));
		}

		return collection;
	}

}
