import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils';

import { parseTemplate, TmplAstNode, TmplAstElement, TmplAstTextAttribute } from '@angular/compiler';

export class DirectiveParser implements ParserInterface {
	public extract(source: string, filePath: string): TranslationCollection | null {
		if (filePath && isPathAngularComponent(filePath)) {
			source = extractComponentInlineTemplate(source);
		}

		let collection: TranslationCollection = new TranslationCollection();

		const nodes: TmplAstNode[] = this.parseTemplate(source, filePath);
		this.getTranslatableElements(nodes).forEach((element) => {
			const key = this.getElementTranslateAttrValue(element) || this.getElementContent(element);
			collection = collection.add(key);
		});

		return collection;
	}

	protected getTranslatableElements(nodes: TmplAstNode[]): TmplAstElement[] {
		return nodes
			.filter((element) => this.isElement(element))
			.reduce((result: TmplAstElement[], element: TmplAstElement) => {
				return result.concat(this.findChildrenElements(element));
			}, [])
			.filter((element) => this.isTranslatable(element));
	}

	protected findChildrenElements(node: TmplAstNode): TmplAstElement[] {
		if (!this.isElement(node)) {
			return [];
		}

		// If element has translate attribute all its content is translatable
		// so we don't need to traverse any deeper
		if (this.isTranslatable(node)) {
			return [node];
		}

		return node.children.reduce(
			(result: TmplAstElement[], childNode: TmplAstNode) => {
				if (this.isElement(childNode)) {
					const children = this.findChildrenElements(childNode);
					return result.concat(children);
				}
				return result;
			},
			[node]
		);
	}

	protected parseTemplate(template: string, path: string): TmplAstNode[] {
		return parseTemplate(template, path).nodes;
	}

	protected isElement(node: any): node is TmplAstElement {
		return node?.attributes && node?.children;
	}

	protected isTranslatable(node: TmplAstNode): boolean {
		if (this.isElement(node) && node.attributes.some((attribute) => attribute.name === 'translate')) {
			return true;
		}
		return false;
	}

	protected getElementTranslateAttrValue(element: TmplAstElement): string {
		const attr: TmplAstTextAttribute = element.attributes.find((attribute) => attribute.name === 'translate');
		return attr?.value ?? '';
	}

	protected getElementContent(element: TmplAstElement): string {
		const content = element.sourceSpan.start.file.content;
		const start = element.startSourceSpan.end.offset;
		const end = element.endSourceSpan.start.offset;
		const val = content.substring(start, end);
		return this.cleanKey(val);
	}

	protected cleanKey(val: string): string {
		return val.replace(/\r?\n|\r|\t/g, '').trim();
	}
}
