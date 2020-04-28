import {
	AST,
	TmplAstNode,
	parseTemplate,
	BindingPipe,
	LiteralPrimitive,
	Conditional,
	TmplAstTextAttribute,
	Binary,
	LiteralMap,
	LiteralArray,
	Interpolation
} from '@angular/compiler';

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

		if (node?.value?.ast) {
			ret.push(...this.getTranslatablesFromAst(node.value.ast));
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
				if (input?.value?.ast) {
					ret.push(...this.getTranslatablesFromAst(input.value.ast));
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

	protected getTranslatablesFromAst(ast: AST): BindingPipe[] {
		// the entire expression is the translate pipe, e.g.:
		// - 'foo' | translate
		// - (condition ? 'foo' : 'bar') | translate
		if (this.expressionIsOrHasBindingPipe(ast)) {
			return [ast];
		}

		// angular double curly bracket interpolation, e.g.:
		// - {{ expressions }}
		if (ast instanceof Interpolation) {
			return this.getTranslatablesFromAsts(ast.expressions);
		}

		// ternary operator, e.g.:
		// - condition ? null : ('foo' | translate)
		// - condition ? ('foo' | translate) : null
		if (ast instanceof Conditional) {
			return this.getTranslatablesFromAsts([ast.trueExp, ast.falseExp]);
		}

		// string concatenation, e.g.:
		// - 'foo' + 'bar' + ('baz' | translate)
		if (ast instanceof Binary) {
			return this.getTranslatablesFromAsts([ast.left, ast.right]);
		}

		// a pipe on the outer expression, but not the translate pipe - ignore the pipe, visit the expression, e.g.:
		// - { foo: 'Hello' | translate } | json
		if (ast instanceof BindingPipe) {
			return this.getTranslatablesFromAst(ast.exp);
		}

		// object - ignore the keys, visit all values, e.g.:
		// - { key1: 'value1' | translate, key2: 'value2' | translate }
		if (ast instanceof LiteralMap) {
			return this.getTranslatablesFromAsts(ast.values);
		}

		// array - visit all its values, e.g.:
		// - [ 'value1' | translate, 'value2' | translate ]
		if (ast instanceof LiteralArray) {
			return this.getTranslatablesFromAsts(ast.expressions);
		}

		return [];
	}

	protected getTranslatablesFromAsts(asts: AST[]): BindingPipe[] {
		return this.flatten(asts.map(ast => this.getTranslatablesFromAst(ast)));
	}

	protected flatten<T extends AST>(array: T[][]): T[] {
		return [].concat(...array);
	}

	protected expressionIsOrHasBindingPipe(exp: any): exp is BindingPipe {
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
