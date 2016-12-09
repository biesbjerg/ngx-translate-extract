import { ParserInterface } from './parser.interface';
import { AbstractTemplateParser } from './abstract-template.parser';
import { StringCollection } from '../utils/string.collection';

import * as $ from 'cheerio';

export class DirectiveParser extends AbstractTemplateParser implements ParserInterface {

	public extract(contents: string, path?: string): StringCollection {
		if (path && this._isAngularComponent(path)) {
			contents = this._extractInlineTemplate(contents);
		}

		return this._parseTemplate(contents);
	}

	protected _parseTemplate(template: string): StringCollection {
		const collection = new StringCollection();

		template = this._normalizeTemplateAttributes(template);
		$(template)
			.find('[translate],[ng2-translate]')
			.addBack()
			.each((i: number, element: CheerioElement) => {
				const $element = $(element);
				const attr = $element.attr('translate') || $element.attr('ng2-translate');

				if (attr) {
					collection.add(attr);
				} else {
					$element
						.contents()
						.toArray()
						.filter(textNode => textNode.type === 'text')
						.map(textNode => textNode.nodeValue.trim())
						.filter(text => text.length > 0)
						.forEach(text => collection.add(text));
				}
			});

		return collection;
	}

}
