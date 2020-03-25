import { TmplAstNode, parseTemplate, BindingPipe, LiteralPrimitive, Conditional, TmplAstTextAttribute } from '@angular/compiler';

import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils';

const TRANSLATE_PIPE_NAME = 'translate';

export class PipeParser implements ParserInterface {
	public extract(source: string, filePath: string): TranslationCollection | null {
		if (filePath && isPathAngularComponent(filePath)) {
			source = extractComponentInlineTemplate(source);
		}

		let collection: TranslationCollection = new TranslationCollection();
		const nodes: TmplAstNode[] = this.parseTemplate(source, filePath);
		const pipes: BindingPipe[] = nodes.map((node) => this.findPipesInNode(node)).flat();
		pipes.forEach((pipe) => {
			this.parseTranslationKeysFromPipe(pipe).forEach((key: string) => {
				collection = collection.add(key);
			});
		});
		return collection;
	}

	protected findPipesInNode(node: any): BindingPipe[] {
		let ret: BindingPipe[] = [];

		if (node?.children) {
			ret = node.children.reduce(
				(result: BindingPipe[], childNode: TmplAstNode) => {
					const children = this.findPipesInNode(childNode);
					return result.concat(children);
				},
				[ret]
			);
		}

		if (node?.value?.ast?.expressions) {
			const translateables = node.value.ast.expressions.filter((exp: any) => this.expressionIsOrHasBindingPipe(exp));
			ret.push(...translateables);
		}

		if (node?.attributes) {
			const translateableAttributes = node.attributes.filter((attr: TmplAstTextAttribute) => {
				return attr.name === TRANSLATE_PIPE_NAME;
			});
			ret = [...ret, ...translateableAttributes];
		}

		if (node?.inputs) {
			node.inputs.forEach((input: any) => {
				// <element [attrib]="'identifier' | translate">
				if (input?.value?.ast && this.expressionIsOrHasBindingPipe(input.value.ast)) {
					ret.push(input.value.ast);
				}

				// <element attrib="{{'identifier' | translate}}>"
				if (input?.value?.ast?.expressions) {
					input.value.ast.expressions.forEach((exp: BindingPipe) => {
						if (this.expressionIsOrHasBindingPipe(exp)) {
							ret.push(exp);
						}
					});
				}
			});
		}

		return ret;
	}

	protected parseTranslationKeysFromPipe(pipeContent: BindingPipe | LiteralPrimitive | Conditional): string[] {
		const ret: string[] = [];
		if (pipeContent instanceof LiteralPrimitive) {
			ret.push(pipeContent.value);
		} else if (pipeContent instanceof Conditional) {
			const trueExp: LiteralPrimitive | Conditional = pipeContent.trueExp as any;
			ret.push(...this.parseTranslationKeysFromPipe(trueExp));
			const falseExp: LiteralPrimitive | Conditional = pipeContent.falseExp as any;
			ret.push(...this.parseTranslationKeysFromPipe(falseExp));
		} else if (pipeContent instanceof BindingPipe) {
			ret.push(...this.parseTranslationKeysFromPipe(pipeContent.exp as any));
		}
		return ret;
	}

	protected expressionIsOrHasBindingPipe(exp: any): boolean {
		if (exp.name && exp.name === TRANSLATE_PIPE_NAME) {
			return true;
		}
		if (exp.exp && exp.exp instanceof BindingPipe) {
			return this.expressionIsOrHasBindingPipe(exp.exp);
		}
		return false;
	}

	protected parseTemplate(template: string, path: string): TmplAstNode[] {
		return parseTemplate(template, path).nodes;
	}
}
