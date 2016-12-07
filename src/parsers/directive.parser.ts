import { ParserInterface } from './parser.interface';
import { AbstractTemplateParser } from './abstract-template.parser';

import * as $ from 'cheerio';

export class DirectiveParser extends AbstractTemplateParser implements ParserInterface {

	public process(filePath: string, contents: string): string[] {
		if (this._isAngularComponent(filePath)) {
			contents = this._extractInlineTemplate(contents);
		}

		return this._parseTemplate(contents);
	}

	protected _parseTemplate(template: string): string[] {
		let results: string[] = [];

		template = this._normalizeTemplateAttributes(template);
		$(`<div>${template}</div>`)
			.find('[translate],[ng2-translate]')
			.each((i: number, element: CheerioElement) => {
				const $element = $(element);
				const attr = $element.attr('translate'),
					attr2 = $element.attr('ng2-translate');

				if (attr || attr2) {
					results.push(attr || attr2);
				} else {
					$element
						.contents()
						.toArray()
						.filter(textNode => textNode.type === 'text')
						.map(textNode => textNode.nodeValue.trim())
						.filter(text => text.length > 0)
						.forEach(text => results.push(text));
				}
			});

		return results;
	}

}
