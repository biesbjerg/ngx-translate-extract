import {AbstractTemplateParser} from './abstract-template.parser';
import {TranslationCollection} from '../utils/translation.collection';

/**
 * For attributes known to contain translation keys, extract their literal values (but not value bindings, as template
 * expressions can generally not be evaluated at build time).
 */
export class TranslatedAttributeParser extends AbstractTemplateParser {

	constructor(private attributeNames: string[]) {
		super();
	}

	protected _parseTemplate(template: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		const regExp = /\s(\w*)="(.*?)"/g;
		let match: RegExpExecArray;
		while (match = regExp.exec(template)) {
			if (this.attributeNames.indexOf(match[1]) != -1) {
				collection = collection.add(match[2]);
			}
		}

		return collection;
	}
}
