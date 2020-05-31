import {
	AST,
	ASTWithSource,
	TmplAstNode as Node,
	TmplAstBoundText as BoundText,
	TmplAstElement as Element,
	TmplAstTemplate as Template,
	TmplAstBoundAttribute as BoundAttribute,
	TmplAstBoundEvent as BoundEvent,
	parseTemplate,
	BindingPipe,
	LiteralPrimitive,
	Conditional,
	Binary,
	LiteralMap,
	LiteralArray,
	Interpolation
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
		const pipes = this.getBindingPipes(nodes, TRANSLATE_PIPE_NAME).filter((pipe) => !this.pipeHasConcatenatedString(pipe));

		pipes.forEach((pipe) => {
			this.visitEachChild(pipe, (child) => {
				if (child instanceof LiteralPrimitive) {
					collection = collection.add(child.value);
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

	protected visitEachChild(exp: AST, visitor: (child: AST) => void): void {
		visitor(exp);

		let children: AST[] = [];
		if (exp instanceof BoundText) {
			children = [exp.value];
		} else if (exp instanceof BoundAttribute) {
			children = [exp.value];
		} else if (exp instanceof BoundEvent) {
			children = [exp.handler];
		} else if (exp instanceof Interpolation) {
			children = exp.expressions;
		} else if (exp instanceof LiteralArray) {
			children = exp.expressions;
		} else if (exp instanceof LiteralMap) {
			children = exp.values;
		} else if (exp instanceof BindingPipe) {
			children = [exp.exp, ...exp.args];
		} else if (exp instanceof Conditional) {
			children = [exp.trueExp, exp.falseExp];
		} else if (exp instanceof Binary) {
			children = [exp.left, exp.right];
		} else if (exp instanceof ASTWithSource) {
			children = [exp.ast];
		}

		children.forEach((child) => {
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

	/**
	 * Check if pipe concatenates string (in that case we don't want to extract it)
	 * @param pipe
	 */
	protected pipeHasConcatenatedString(pipe: BindingPipe): boolean {
		return pipe?.exp instanceof Binary && pipe.exp.operation === '+';
	}

	protected parseTemplate(template: string, path: string): Node[] {
		return parseTemplate(template, path).nodes;
	}
}
