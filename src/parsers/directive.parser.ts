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
			.contents() // get child nodes
			.filter(function() { // only keep text nodes
				console.log(this.data);
				return this.nodeType === 3; // node type 3 = text node
			}).each((i: number, element: CheerioElement) => {
			const $element = $(element);
			const attr = $element.parent().attr('translate');
			const text = $element.text().trim();

			if (attr) {
				results.push(attr);
			} else if (text) {
				results.push(text);
			}
		});

		return results;
	}

}
