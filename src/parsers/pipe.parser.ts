import {
	AST,
	TmplAstNode as Node,
	TmplAstBoundText as BoundText,
	TmplAstElement as Element,
	TmplAstTemplate as Template,
	TmplAstBoundAttribute as BoundAttribute,
	parseTemplate,
	BindingPipe,
	LiteralPrimitive,
	Conditional,
	TmplAstTextAttribute,
	Binary,
	LiteralMap,
	LiteralArray,
	Interpolation,
	ASTWithSource,
	TmplAstBoundEvent as BoundEvent
} from '@angular/compiler';

import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils';

const TRANSLATE_PIPE_NAME = 'translate';
type ElementLike = Element | Template;

export class PipeParser implements ParserInterface {
	public extract(source: string, filePath: string): TranslationCollection | null {
		let collection: TranslationCollection = new TranslationCollection();

		if (filePath && isPathAngularComponent(filePath)) {
			source = extractComponentInlineTemplate(source);
		}
		const nodes: Node[] = this.parseTemplate(source, filePath);
		const pipes = this.getBindingPipes(nodes, TRANSLATE_PIPE_NAME);

		pipes.forEach((pipe) => {
			// Skip concatenated strings
			if (pipe.exp instanceof Binary && pipe.exp.operation === '+') {
				return;
			}
			this.visitEachChild(pipe, (exp) => {
				if (exp instanceof LiteralPrimitive) {
					collection = collection.add(exp.value);
				}
			});
		});

		return collection;
	}

	protected getBindingPipes(nodes: any[], name: string): BindingPipe[] {
		let pipes: BindingPipe[] = [];
		nodes.forEach((node) => {
			if (this.isElementLike(node)) {
				pipes = [
					...pipes,
					...this.getBindingPipes([
						...node.inputs,
						...node.children
					], name)
				];
			}

			this.visitEachChild(node, (exp) => {
				if (exp instanceof BindingPipe && exp.name === name) {
					pipes = [...pipes, exp];
				}
			});
		});
		return pipes;
	}

	protected visitEachChild(exp: AST, visitor: (exp: AST) => void): void {
		visitor(exp);

		let childExp: AST[] = [];
		if (exp instanceof BoundText) {
			childExp = [exp.value];
		} else if (exp instanceof BoundAttribute) {
			childExp = [exp.value];
		} else if (exp instanceof BoundEvent) {
			childExp = [exp.handler];
		} else if (exp instanceof Interpolation) {
			childExp = exp.expressions;
		} else if (exp instanceof LiteralArray) {
			childExp = exp.expressions;
		} else if (exp instanceof LiteralMap) {
			childExp = exp.values;
		} else if (exp instanceof BindingPipe) {
			childExp = [exp.exp, ...exp.args];
		} else if (exp instanceof Conditional) {
			childExp = [exp.trueExp, exp.falseExp];
		} else if (exp instanceof Binary) {
			childExp = [exp.left, exp.right];
		} else if (exp instanceof ASTWithSource) {
			childExp = [exp.ast];
		}

		childExp.forEach((child) => {
			this.visitEachChild(child, visitor);
		});
	}

	/**
	 * Check if node type is ElementLike
	 * @param node
	 */
	protected isElementLike(node: Node): node is ElementLike {
		return node instanceof Element || node instanceof Template;
	}

	protected parseTemplate(template: string, path: string): Node[] {
		return parseTemplate(template, path).nodes;
	}
}
