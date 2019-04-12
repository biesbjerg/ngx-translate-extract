import * as ts from 'typescript';

export abstract class AbstractAstParser {

	protected _sourceFile: ts.SourceFile;

	protected _createSourceFile(path: string, contents: string): ts.SourceFile {
		return ts.createSourceFile(path, contents, null, /*setParentNodes */ false);
	}

	/**
	 * Get strings from function call's first argument
	 */
	protected _getCallArgStrings(callNode: ts.CallExpression): string[] {
		if (!callNode.arguments.length) {
			return;
		}

		const firstArg = callNode.arguments[0];
		return this._getStringsFromExpression(firstArg);
	}

	/**
	 * Get strings from an arbitrary JS expression
	 */
	protected _getStringsFromExpression(expression: ts.Expression): string[] {
		switch (expression.kind) {
			case ts.SyntaxKind.StringLiteral:
			case ts.SyntaxKind.FirstTemplateToken:
				// Example: __('This is a sentence.')
				return [(expression as ts.StringLiteral).text];
			case ts.SyntaxKind.ArrayLiteralExpression:
				return (expression as ts.ArrayLiteralExpression).elements
					.map((element: ts.StringLiteral) => element.text);
			case ts.SyntaxKind.BinaryExpression:
				// Example: __('str1' + 'str2')
				const binExp = expression as ts.BinaryExpression;
				const left = this._getStringsFromExpression(binExp.left)[0],
				      right = this._getStringsFromExpression(binExp.right)[0];
				if (binExp.operatorToken.kind === ts.SyntaxKind.PlusToken &&
					typeof left === 'string' && typeof right === 'string') {
					return [left + right];
				}
				console.log(`SKIP: Unknown BinaryExpression: `, expression);
				break;
			case ts.SyntaxKind.Identifier:
				console.log('WARNING: We cannot extract variable values passed to TranslateService (yet)');
				break;
			default:
				console.log(`SKIP: Unknown argument type: '${this._syntaxKindToName(expression.kind)}'`, expression);
		}
	}

	/**
	 * Find all child nodes of a kind
	 */
	protected _findNodes(node: ts.Node, kind: ts.SyntaxKind): ts.Node[] {
		const childrenNodes: ts.Node[] = node.getChildren(this._sourceFile);
		const initialValue: ts.Node[] = node.kind === kind ? [node] : [];

		return childrenNodes.reduce((result: ts.Node[], childNode: ts.Node) => {
			return result.concat(this._findNodes(childNode, kind));
		}, initialValue);
	}

	protected _syntaxKindToName(kind: ts.SyntaxKind): string {
		return ts.SyntaxKind[kind];
	}

	protected _printAllChildren(sourceFile: ts.SourceFile, node: ts.Node, depth = 0): void {
		console.log(
			new Array(depth + 1).join('----'),
			`[${node.kind}]`,
			this._syntaxKindToName(node.kind),
			`[pos: ${node.pos}-${node.end}]`,
			':\t\t\t',
			node.getFullText(sourceFile).trim()
		);

		depth++;
		node.getChildren(sourceFile).forEach(childNode => this._printAllChildren(sourceFile, childNode, depth));
	}

}
