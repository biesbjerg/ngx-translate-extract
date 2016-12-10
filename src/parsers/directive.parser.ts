import { ParserInterface } from './parser.interface';
import { AbstractTemplateParser } from './abstract-template.parser';
import { TranslationCollection } from '../utils/translation.collection';

import * as $ from 'cheerio';

export class DirectiveParser extends AbstractTemplateParser implements ParserInterface {

	public extract(contents: string, path?: string): TranslationCollection {
		if (path && this._isAngularComponent(path)) {
			contents = this._extractInlineTemplate(contents);
		}

		return this._parseTemplate(contents);
	}

	protected _parseTemplate(template: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		template = this._normalizeTemplateAttributes(template);

		const selector = '[translate], [ng2-translate]';
		$(template)
			.find(selector)
			.addBack(selector)
			.each((i: number, element: CheerioElement) => {
				const $element = $(element);
				const attr = $element.attr('translate') || $element.attr('ng2-translate');

				if (attr) {
					collection = collection.add(attr);
				} else {
					$element
						.contents()
						.toArray()
						.filter(node => node.type === 'text')
						.map(node => node.nodeValue.trim())
						.filter(text => text.length > 0)
						.forEach(text => collection = collection.add(text));
				}
			});

		return collection;
	}

}
