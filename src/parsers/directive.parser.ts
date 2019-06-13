import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils';

import * as cheerio from 'cheerio';

const $ = cheerio.load('', { xmlMode: true });

export class DirectiveParser implements ParserInterface {

	public extract(contents: string, path?: string): TranslationCollection {
		if (path && isPathAngularComponent(path)) {
			contents = extractComponentInlineTemplate(contents);
		}

		return this.parseTemplate(contents);
	}

	protected parseTemplate(template: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		const selector = '[translate], [ng2-translate]';

		template = this.prepareTemplate(template);
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

	protected prepareTemplate(template: string): string {
		return this.wrapTemplate(
			this.normalizeTemplateAttributes(template)
		);
	}

	/**
	 * Angular's `[attr]="'val'"` syntax is not valid HTML,
	 * so it can't be parsed by standard HTML parsers.
	 * This method replaces `[attr]="'val'""` with `attr="val"`
	 */
	protected normalizeTemplateAttributes(template: string): string {
		return template.replace(/\[([^\]]+)\]="'([^']*)'"/g, '$1="$2"');
	}

	/**
	 * Wraps template in tag
	 */
	protected wrapTemplate(template: string, tag: string = 'div'): string {
		return `<${tag}>${template}</${tag}>`;
	}

}
