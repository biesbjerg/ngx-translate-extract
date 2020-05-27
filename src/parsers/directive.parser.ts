import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils';

import { parseTemplate, TmplAstNode, TmplAstElement, TmplAstText, TmplAstTemplate } from '@angular/compiler';

export class DirectiveParser implements ParserInterface {
	public extract(source: string, filePath: string): TranslationCollection | null {
		if (filePath && isPathAngularComponent(filePath)) {
			source = extractComponentInlineTemplate(source);
		}

		let collection: TranslationCollection = new TranslationCollection();

		const nodes: TmplAstNode[] = this.parseTemplate(source, filePath);
		this.findTranslatableElements(nodes).forEach((element) => {
			const key = this.getTranslateAttribValue(element);
			if (key) {
				collection = collection.add(key);
			} else {
				const keys = this.getTextNodeValues(element);
				keys.forEach((k) => {
					collection = collection.add(k);
				});
			}
		});
		return collection;
	}

	protected findTranslatableElements(nodes: TmplAstNode[]): TmplAstElement[] {
		return nodes
			.reduce((elements: TmplAstElement[], node: TmplAstNode) => {
				return [...elements, ...this.findChildrenElements(node)];
			}, [])
			.filter((element) => this.isTranslatable(element));
	}

	protected findChildrenElements(node: TmplAstNode): TmplAstElement[] {
		if (!this.isElement(node)) {
			return [];
		}
		return node.children.reduce(
			(elements: TmplAstElement[], childNode: TmplAstNode) => {
				return [...elements, ...this.findChildrenElements(childNode)];
			},
			[node]
		);
	}

	protected parseTemplate(template: string, path: string): TmplAstNode[] {
		return parseTemplate(template, path).nodes;
	}

	protected isElement(node: any): node is TmplAstElement {
		return node instanceof TmplAstElement || node instanceof TmplAstTemplate;
	}

	protected isTranslatable(node: TmplAstElement): boolean {
		if (node.attributes.some((attribute) => attribute.name === 'translate')) {
			return true;
		}
		return false;
	}

	protected getTranslateAttribValue(element: TmplAstElement): string | undefined {
		return element.attributes.find((attribute) => attribute.name === 'translate')?.value;
	}

	protected getTextNodeValues(element: TmplAstElement): string[] {
		return element.children
			.filter((child) => child instanceof TmplAstText)
			.map((child: TmplAstText) => child.value.trim());
	}
}
