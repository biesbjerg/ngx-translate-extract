import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils';
import { TmplAstNode, parseTemplate, BindingPipe, LiteralPrimitive, Conditional, TmplAstTextAttribute } from '@angular/compiler';

export class PipeParser implements ParserInterface {
	public extract(source: string, filePath: string): TranslationCollection | null {
		if (filePath && isPathAngularComponent(filePath)) {
			source = extractComponentInlineTemplate(source);
		}

		let collection: TranslationCollection = new TranslationCollection();
		const nodes: TmplAstNode[] = this.parseTemplate(source, filePath);
		const pipes: BindingPipe[] = nodes.map(node => this.findPipesInNode(node)).flat();
		pipes.forEach(pipe => {
			this.parseTranslationKeysFromPipe(pipe).forEach((key: string) => {
				collection = collection.add(key);
			});
		});
		return collection;
	}

	protected findPipesInNode(node: any): BindingPipe[] {
		let ret: BindingPipe[] = [];

		if (node.children) {
			ret = node.children.reduce(
				(result: BindingPipe[], childNode: TmplAstNode) => {
					const children = this.findPipesInNode(childNode);
					return result.concat(children);
				},
				[ret]
			);
		}

		if (node.value && node.value.ast && node.value.ast.expressions) {
			const translateables = node.value.ast.expressions.filter((exp: any) => this.expressionIsOrHasBindingPipe(exp));
			ret.push(...translateables);
		}

		if (node.attributes) {
			const translateableAttributes = node.attributes.filter((attr: TmplAstTextAttribute) => {
				return attr.name === 'translate';
			});
			ret = [...ret, ...translateableAttributes];
		}

		if (node.inputs) {
			node.inputs.forEach((input: any) => {
				// <element [attrib]="'identifier' | translate">
				if (input.value && input.value.ast && this.expressionIsOrHasBindingPipe(input.value.ast)) {
					ret.push(input.value.ast);
				}

				// <element attrib="{{'identifier' | translate}}>"
				if (input.value && input.value.ast && input.value.ast.expressions) {
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

	protected parseTranslationKeysFromPipe(pipe: BindingPipe): string[] {
		const ret: string[] = [];
		if (pipe.exp instanceof LiteralPrimitive) {
			ret.push(pipe.exp.value);
		} else if (pipe.exp instanceof Conditional) {
			const trueExp: LiteralPrimitive = (pipe.exp.trueExp as any) as LiteralPrimitive;
			const falseExp: LiteralPrimitive = (pipe.exp.falseExp as any) as LiteralPrimitive;
			ret.push(trueExp.value);
			ret.push(falseExp.value);
		} else if (pipe.exp instanceof BindingPipe) {
			ret.push(...this.parseTranslationKeysFromPipe(pipe.exp));
		}
		return ret;
	}

	protected expressionIsOrHasBindingPipe(exp: any): boolean {
		if (exp.name && exp.name === 'translate') {
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
