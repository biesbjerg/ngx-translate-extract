import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils';

import { parseTemplate, ElementAst, TmplAstNode, HtmlParser, Node } from '@angular/compiler';
import { Visitor, RecursiveVisitor } from '@angular/compiler/src/ml_parser/ast';

class TemplateVisitor extends RecursiveVisitor {

}

export class TestParser implements ParserInterface {

	public extract(template: string, path: string): TranslationCollection {
		if (path && isPathAngularComponent(path)) {
			template = extractComponentInlineTemplate(template);
		}

		template = '<h2>Hello world</h2>';

		let collection: TranslationCollection = new TranslationCollection();

		const rootNodes = this.parseHtml(template, path);
		const visitor = new TemplateVisitor();

		const result = this.visitAll(visitor, rootNodes);

		console.log(rootNodes);

		return collection;
	}

	protected visitAll(visitor: Visitor, nodes: Node[], context: any = null) {
		const result: any[] = [];

		const visit = visitor.visit ?
			(ast: Node) => visitor.visit !(ast, context) || ast.visit(visitor, context) :
			(ast: Node) => ast.visit(visitor, context);
		nodes.forEach(ast => {
		  const astResult = visit(ast);
		  if (astResult) {
			result.push(astResult);
		  }
		});
		return result;


		/*const result: any[] = [];

		nodes.forEach(node => {
			node.tmpl
			if (visitor.visit) {
				visitor.visit(node.ast)
			}
		});*/
	}

	protected parseHtml(template: string, templateUrl: string): Node[] {
		const htmlParser = new HtmlParser();
		const parseResult = htmlParser.parse(template, templateUrl);
		return parseResult.rootNodes;
	}

	protected parseTemplate(template: string, path: string): TmplAstNode[] {
		return parseTemplate(template, path).nodes;
	}

}
