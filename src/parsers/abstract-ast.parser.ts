import {
	createSourceFile,
	SourceFile,
	CallExpression,
	Node,
	SyntaxKind,
	StringLiteral
} from 'typescript';

export abstract class AbstractAstParser {

	protected sourceFile: SourceFile;

	protected createSourceFile(path: string, contents: string): SourceFile {
		return createSourceFile(path, contents, null, /*setParentNodes */ false);
	}

	/**
	 * Get strings from function call's first argument
	 */
	protected getStringLiterals(callNode: CallExpression): string[] {
		if (!callNode.arguments.length) {
			return[];
		}

		const firstArg = callNode.arguments[0];
		return this.findNodes(firstArg, SyntaxKind.StringLiteral)
			.map((node: StringLiteral) => node.text);
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

}
