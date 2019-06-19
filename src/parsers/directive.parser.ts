import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils';

import { parseTemplate, TmplAstNode, TmplAstElement, TmplAstTextAttribute } from '@angular/compiler';

export class DirectiveParser implements ParserInterface {

	public extract(template: string, path: string): TranslationCollection {
		if (path && isPathAngularComponent(path)) {
			template = extractComponentInlineTemplate(template);
		}

		let collection: TranslationCollection = new TranslationCollection();
		const nodes: TmplAstNode[] = this.parseTemplate(template, path);
		this.getTranslatableElements(nodes).forEach(element => {
			const translateAttr = this.getTranslateAttribute(element);
			const key = translateAttr.value || this.getContents(element);
			collection = collection.add(key);
		});

		return collection;
	}

	protected getTranslatableElements(nodes: TmplAstNode[]): TmplAstElement[] {
		return nodes
			.filter(element => this.isElement(element))
			.reduce((result: TmplAstElement[], element: TmplAstElement) => {
				return result.concat(this.findChildrenElements(element));
			}, [])
			.filter(element => this.hasTranslateAttribute(element));
	}

	protected findChildrenElements(node: TmplAstNode): TmplAstElement[] {
		// Safe guard, since only elements have children
		if (!this.isElement(node)) {
			return [];
		}

		// If element has translate attribute it means all of its contents
		// is translatable, so we don't need to go any deeper
		if (this.hasTranslateAttribute(node)) {
			return [node];
		}

		return node.children.reduce((result: TmplAstElement[], childNode: TmplAstNode) => {
			if (!this.isElement(childNode)) {
				return result;
			}
			return result.concat(this.findChildrenElements(childNode));
		}, [node]);
	}

	protected parseTemplate(template: string, path: string): TmplAstNode[] {
		return parseTemplate(template, path).nodes;
	}

	protected isElement(node: TmplAstNode): node is TmplAstElement {
		return node instanceof TmplAstElement;
	}

	protected getContents(element: TmplAstElement): string {
		const start = element.startSourceSpan.end.offset;
		const end = element.endSourceSpan.start.offset;
		return element.sourceSpan.start.file.content.substring(start, end).trim();
	}

	protected hasTranslateAttribute(element: TmplAstElement): boolean {
		return !!this.getTranslateAttribute(element);
	}

	protected getTranslateAttribute(element: TmplAstElement): TmplAstTextAttribute {
		return element.attributes.find(attribute => attribute.name === 'translate');
	}

}
