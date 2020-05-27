import {
	parseTemplate,
	TmplAstNode as Node,
	TmplAstElement as Element,
	TmplAstText as Text,
	TmplAstTemplate as Template
} from '@angular/compiler';

import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils';

const TRANSLATE_ATTR_NAME = 'translate';
type ElementLike = Element | Template;

export class DirectiveParser implements ParserInterface {
	public extract(source: string, filePath: string): TranslationCollection | null {
		let collection: TranslationCollection = new TranslationCollection();

		if (filePath && isPathAngularComponent(filePath)) {
			source = extractComponentInlineTemplate(source);
		}
		const nodes: Node[] = this.parseTemplate(source, filePath);
		const elements: ElementLike[] = this.getElementsWithTranslateAttribute(nodes);

		elements.forEach((element) => {
			const attr = this.getAttribute(element, TRANSLATE_ATTR_NAME);
			if (attr) {
				collection = collection.add(attr);
				return;
			}
			const textNodes = this.getTextNodes(element);
			textNodes.forEach((textNode: Text) => {
				collection = collection.add(textNode.value.trim());
			});
		});
		return collection;
	}

	/**
	 * Find all ElementLike nodes with a translate attribute
	 * @param nodes
	 */
	protected getElementsWithTranslateAttribute(nodes: Node[]): ElementLike[] {
		let elements: ElementLike[] = [];
		nodes.filter(this.isElementLike)
			.forEach((element) => {
				if (this.hasAttribute(element, TRANSLATE_ATTR_NAME)) {
					elements = [...elements, element];
				}
				const childElements = this.getElementsWithTranslateAttribute(element.children);
				if (childElements.length) {
					elements = [...elements, ...childElements];
				}
			});
		return elements;
	}

	/**
	 * Get direct child nodes of type Text
	 * @param element
	 */
	protected getTextNodes(element: ElementLike): Text[] {
		return element.children.filter(this.isText);
	}

	/**
	 * Check if attribute is present on element
	 * @param element
	 */
	protected hasAttribute(element: ElementLike, name: string): boolean {
		return this.getAttribute(element, name) !== undefined;
	}

	/**
	 * Get attribute value if present on element
	 * @param element
	 */
	protected getAttribute(element: ElementLike, name: string): string | undefined {
		return element.attributes.find((attribute) => attribute.name === name)?.value;
	}

	/**
	 * Check if node type is ElementLike
	 * @param node
	 */
	protected isElementLike(node: Node): node is ElementLike {
		return node instanceof Element || node instanceof Template;
	}

	/**
	 * Check if node type is Text
	 * @param node
	 */
	protected isText(node: Node): node is Text {
		return node instanceof Text;
	}

	/**
	 * Parse a template into nodes
	 * @param template
	 * @param path
	 */
	protected parseTemplate(template: string, path: string): Node[] {
		return parseTemplate(template, path).nodes;
	}

}
