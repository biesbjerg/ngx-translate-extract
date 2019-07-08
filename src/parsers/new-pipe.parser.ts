import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils';

import { parseTemplate, TmplAstNode, TmplAstElement, TmplAstBoundText, ASTWithSource, Interpolation, BindingPipe, LiteralPrimitive, flatten, TmplAstTemplate, TmplAstBoundAttribute } from '@angular/compiler';


export class NewPipeParser implements ParserInterface {

	public getTranslatableString(node: TmplAstBoundAttribute) {
		const bindingPipes = (node.value as ASTWithSource).ast;

		console.log({astWithSrc: bindingPipes});
return;
		const expressions: BindingPipe[] = interpolation.expressions.filter(expression => {
			return expression instanceof BindingPipe
				&& expression.name === 'translate'
				&& expression.exp instanceof LiteralPrimitive;
		});

		console.log({node, astWithSrc: bindingPipes, interpolation, expressions});

/*
		.map((node: TmplAstBoundText) => node.value)
		.map((value: ASTWithSource) => value.ast)
		.map((ast: Interpolation) => ast.expressions)
		.map((expressions: any[]) =>
			expressions.filter(expression =>
				expression instanceof BindingPipe
				&& expression.name === 'translate'
				&& expression.exp instanceof LiteralPrimitive
			)
		)
		.map((expressions: BindingPipe[]) =>
			expressions.map(expression => (expression.exp as LiteralPrimitive).value as string)
		);*/
	}

	public extract(template: string, path: string): TranslationCollection {
		if (path && isPathAngularComponent(path)) {
			template = extractComponentInlineTemplate(template);
		}

	//	template = '<h1>{{ "Hello World" | translate }} {{ "Another string" | translate }}</h1><body><strong>Hello</strong> {{ "World (translatable)" | translate }}</body>';

		template = `
			<span [attr]="'Hello World' | translate"></span>
			<div key="{{ 'message' | translate | upper }}">
				<strong subattr="{{ 'hello last' | translate }}">{{ 'tag content' | translate }}</strong>
			</div>
		`;

		template = `{{ 'hello' | translate | upper }}`;

		const rootNodes: TmplAstNode[] = this.parseTemplate(template, path);

		const pipes: BindingPipe[] = rootNodes.reduce((result: BindingPipe[], rootNode: TmplAstNode) => {
			return result.concat(this.findBindingPipeNodes(rootNode));
		}, []);



		const flat = flatten(pipes.map(pipe => this.flattenBindingPipeNodes(pipe)));

		console.log(flat);

		return new TranslationCollection();

		const boundTextNodes: TmplAstBoundText[] = rootNodes.reduce((result: TmplAstBoundText[], rootNode: TmplAstNode) => {
			return result.concat(this.findBoundTextNodes(rootNode));
		}, []);

		console.log(boundTextNodes);

		const result = boundTextNodes
			.map((node: TmplAstBoundText) => node.value)
			.map((value: ASTWithSource) => value.ast)
			.map((ast: Interpolation) => ast.expressions)
			.map((expressions: any[]) =>
				expressions.filter(expression =>
					expression instanceof BindingPipe
					&& expression.name === 'translate'
					&& expression.exp instanceof LiteralPrimitive
				)
			)
			.map((expressions: BindingPipe[]) =>
				expressions.map(expression => (expression.exp as LiteralPrimitive).value as string)
			);

		let collection: TranslationCollection = new TranslationCollection();
		flatten(result).forEach(key => collection = collection.add(key));

		return collection;
	}

	protected flattenBindingPipeNodes(node: BindingPipe): BindingPipe[] {
		let ret: BindingPipe[] = [];
		ret = [node];
		if (node.exp instanceof BindingPipe) {
			return ret.concat(this.flattenBindingPipeNodes(node.exp));
		}
		return ret;
	}

	protected findBindingPipeNodes(node: TmplAstNode): BindingPipe[] {
		let bindingPipes: BindingPipe[] = [];

		if (node instanceof BindingPipe) {
			bindingPipes.push(node);
/*			let expression = node.exp;
			console.log('YOYOOYOYOY', expression);
			while (expression instanceof BindingPipe) {
				bindingPipes.push(expression);
				expression = expression.exp;
				console.log('puhs');
			}*/
		}

		// <p>{{ 'message' | translate }}</p>
		// <p key="{{ 'message' | translate }}"></p>
		if (node instanceof TmplAstBoundText || node instanceof TmplAstBoundAttribute) {
			const expressions = ((node.value as ASTWithSource).ast as Interpolation).expressions;
			if (expressions) {
				bindingPipes = bindingPipes.concat(expressions.filter(expression => expression instanceof BindingPipe));
			}
		}

		/*console.log('');
		console.log(node);
		console.log('');*/

		// Visit element/template attributes
		if (node instanceof TmplAstElement || node instanceof TmplAstTemplate) {
			const childBuffer = node.inputs.reduce((result: BindingPipe[], childNode: TmplAstNode) => {
				return this.findBindingPipeNodes(childNode);
			}, []);

			bindingPipes = bindingPipes.concat(childBuffer);
		}

		// Visit element/template children
		if (node instanceof TmplAstElement || node instanceof TmplAstTemplate) {
			const childBuffer = node.children.reduce((result: BindingPipe[], childNode: TmplAstNode) => {
				return this.findBindingPipeNodes(childNode);
			}, []);

			bindingPipes = bindingPipes.concat(childBuffer);
		}

		return bindingPipes;
	}

	protected findBoundTextNodes(node: TmplAstNode): TmplAstBoundText[] {
		if (node instanceof TmplAstBoundText) {
			return [node];
		}
		if (node instanceof TmplAstElement || node instanceof TmplAstTemplate) {
			return node.children.reduce((result: TmplAstBoundText[], childNode: TmplAstNode) => {
				return this.findBoundTextNodes(childNode);
			}, []);
		}
		return [];
	}

	protected findBoundAttrNodes(node: TmplAstNode): TmplAstBoundAttribute[] {
		if (node instanceof TmplAstBoundAttribute) {
			return [node];
		}
		if (node instanceof TmplAstElement || node instanceof TmplAstTemplate) {
			return node.inputs.reduce((result: TmplAstBoundAttribute[], boundAttribute: TmplAstBoundAttribute) => {
				return this.findBoundAttrNodes(boundAttribute);
			}, []);
		}
		return [];
	}

	protected parseTemplate(template: string, path: string): TmplAstNode[] {
		return parseTemplate(template, path).nodes;
	}

}
