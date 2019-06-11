import * as ts from 'typescript';
import { yellow } from 'colorette';

export abstract class AbstractAstParser {

	protected sourceFile: ts.SourceFile;

	protected createSourceFile(path: string, contents: string): ts.SourceFile {
		return ts.createSourceFile(path, contents, null, /*setParentNodes */ false);
	}

	/**
	 * Get strings from function call's first argument
	 */
	protected getCallArgStrings(callNode: ts.CallExpression): string[] {
		if (!callNode.arguments.length) {
			return;
		}

		const firstArg = callNode.arguments[0];
		switch (firstArg.kind) {
			case ts.SyntaxKind.StringLiteral:
			case ts.SyntaxKind.FirstTemplateToken:
				return [(firstArg as ts.StringLiteral).text];
			case ts.SyntaxKind.ArrayLiteralExpression:
				return (firstArg as ts.ArrayLiteralExpression).elements
					.map((element: ts.StringLiteral) => element.text);
			case ts.SyntaxKind.Identifier:
				// TODO
				console.log(yellow('[Line: %d] We do not support values passed to TranslateService'), this.getLine(firstArg));
				break;
			case ts.SyntaxKind.BinaryExpression:
				// TODO
				console.log(yellow('[Line: %d] We do not support binary expressions (yet)'), this.getLine(firstArg));
				break;
			default:
				console.log(yellow(`[Line: %d] Unknown argument type: %s`), this.getLine(firstArg), this.syntaxKindToName(firstArg.kind), firstArg);
		}
	}

	/**
	 * Find all child nodes of a kind
	 */
	protected findNodes(node: ts.Node, kind: ts.SyntaxKind): ts.Node[] {
		const childrenNodes: ts.Node[] = node.getChildren(this.sourceFile);
		const initialValue: ts.Node[] = node.kind === kind ? [node] : [];

		return childrenNodes.reduce((result: ts.Node[], childNode: ts.Node) => {
			return result.concat(this.findNodes(childNode, kind));
		}, initialValue);
	}

	protected getLine(node: ts.Node): number {
		const { line } = this.sourceFile.getLineAndCharacterOfPosition(node.pos);
		return line + 1;
	}

	protected syntaxKindToName(kind: ts.SyntaxKind): string {
		return ts.SyntaxKind[kind];
	}

	protected printAllChildren(sourceFile: ts.SourceFile, node: ts.Node, depth = 0): void {
		console.log(
			new Array(depth + 1).join('----'),
			`[${node.kind}]`,
			this.syntaxKindToName(node.kind),
			`[pos: ${node.pos}-${node.end}]`,
			':\t\t\t',
			node.getFullText(sourceFile).trim()
		);

		depth++;
		node.getChildren(sourceFile).forEach(childNode => this.printAllChildren(sourceFile, childNode, depth));
	}

}
