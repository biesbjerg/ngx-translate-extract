import {
	createSourceFile,
	SourceFile,
	CallExpression,
	Node,
	SyntaxKind,
	StringLiteral,
	isStringLiteralLike,
	isBinaryExpression,
	isTemplateLiteralToken,
	isArrayLiteralExpression
} from 'typescript';
import { yellow } from 'colorette';

export abstract class AbstractAstParser {

	protected sourceFile: SourceFile;

	protected createSourceFile(path: string, contents: string): SourceFile {
		return createSourceFile(path, contents, null, /*setParentNodes */ false);
	}

	/**
	 * Get strings from function call's first argument
	 */
	protected getCallArgStrings(callNode: CallExpression): string[] {
		if (!callNode.arguments.length) {
			return;
		}

		const node = callNode.arguments[0];

		if (isStringLiteralLike(node) || isTemplateLiteralToken(node)) {
			return [node.text];
		}

		if (isArrayLiteralExpression(node)) {
			return node.elements
				.map((element: StringLiteral) => element.text);
		}

		if (isBinaryExpression(node)) {
			return [node.right]
				.filter(childNode => isStringLiteralLike(childNode))
				.map((childNode: StringLiteral) => childNode.text);
		}

		console.log(yellow(`Unsupported syntax kind in line %d: %s`), this.getLineNumber(node), this.syntaxKindToName(node.kind));

		return [];
	}

	/**
	 * Find all child nodes of a kind
	 */
	protected findNodes(node: Node, kind: SyntaxKind): Node[] {
		const childrenNodes: Node[] = node.getChildren(this.sourceFile);
		const initialValue: Node[] = node.kind === kind ? [node] : [];

		return childrenNodes.reduce((result: Node[], childNode: Node) => {
			return result.concat(this.findNodes(childNode, kind));
		}, initialValue);
	}

	protected getLineNumber(node: Node): number {
		const { line } = this.sourceFile.getLineAndCharacterOfPosition(node.pos);
		return line + 1;
	}

	protected syntaxKindToName(kind: SyntaxKind): string {
		return SyntaxKind[kind];
	}

	protected printAllChildren(sourceFile: SourceFile, node: Node, depth = 0): void {
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
