import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils';

import { parseTemplate, TmplAstNode, TmplAstBoundAttribute, TmplAstBoundText, TmplAstText, TmplAstTextAttribute, TmplAstBoundEvent } from '@angular/compiler';

import { visitAll, NullVisitor, RecursiveVisitor } from '@angular/compiler/src/render3/r3_ast';

/*export class PipeCollector extends RecursiveAstVisitor {
	public pipes = new Map<string, BindingPipe>();
	public visitPipe(ast: BindingPipe, context: any): any {
		console.log('VISIT PIPE');
		this.pipes.set(ast.name, ast);
		ast.exp.visit(this);
		this.visitAll(ast.args, context);
		return null;
	}
}*/

export class PipeV2Parser implements ParserInterface {

	public extract(template: string, path: string): TranslationCollection {
		if (path && isPathAngularComponent(path)) {
			template = extractComponentInlineTemplate(template);
		}

	//	template = '<h1>{{ "Hello World" | translate }} {{ "Another string" | translate }}</h1><body><strong>Hello</strong> {{ "World (translatable)" | translate }}</body>';

		template = `
			{{ 'Some text' }}
			<span [attr]="'Hello World' | translate"></span>
			<div hello key="{{ 'message' | translate | upper }}">
				<strong subattr="{{ 'hello last' | translate }}">{{ 'tag content' | translate }}</strong>
			</div>
		`;

		template = `
			{{ 'hello' | translate }}
			<span [testing]="'bound attr?'"></span>
			<div attr="this attribute has text"></div>
			<h1>{{ 'HEADER' }}<h1>
			<header (click)="dosomething()"></header>
		`;

		const templateNodes: TmplAstNode[] = this.parseTemplate(template, path);
		const visitor = new MyVisitor2();

		visitAll(visitor, templateNodes);

		// const rootNodes: TmplAstNode[] = this.parseTemplate(template, path);

		// const visitor = new MyVisitor2();

/*
		rootNodes.forEach(rootNode => {
			rootNode.visit(visitor);
		});
*/
		return new TranslationCollection();
	}

	protected parseTemplate(template: string, path: string): TmplAstNode[] {
		return parseTemplate(template, path).nodes;
	}

}

class MyVisitor2 extends RecursiveVisitor {
	visitBoundText(text: TmplAstBoundText): void {
		console.log('boundText\n', text);
	}

	visitBoundAttribute(attribute: TmplAstBoundAttribute): void {
		console.log('boundAttr\n', attribute);
	}

	visitTextAttribute(attribute: TmplAstTextAttribute): void {
		console.log('text attr\n', attribute);
	}

	visitText(text: TmplAstText): void {
		console.log('text\n', text);
	}

	visitBoundEvent(attribute: TmplAstBoundEvent): void {
		console.log('YAAAS');
	}
}
/*
class MyVisitor extends RecursiveVisitor {
	constructor() { super(); }

	visitBoundText(text: TmplAstBoundText): void {
		console.log('boundText\n', text);
	}

	visitBoundAttribute(attribute: TmplAstBoundAttribute): void {
		console.log('boundAttr\n', attribute);
	}

	visitTextAttribute(attribute: TmplAstTextAttribute): void {
		console.log('text attr\n', attribute);
	}

	visitText(text: TmplAstText): void {
		console.log('text\n', text);
	}

	visitBoundEvent(attribute: TmplAstBoundEvent): void {
		console.log('YAAAS');
	}

}
*/
