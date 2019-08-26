import {
	createSourceFile,
	SourceFile,
	CallExpression,
	Node,
	SyntaxKind,
	StringLiteral,
	NoSubstitutionTemplateLiteral
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

		return this.findNodes(firstArg, [
			SyntaxKind.StringLiteral,
			SyntaxKind.NoSubstitutionTemplateLiteral
		])
		.map((node: StringLiteral | NoSubstitutionTemplateLiteral) => node.text);
	}

	/**
	 * Find all child nodes of a kind
	 */
	protected findNodes(node: Node, kinds: SyntaxKind[]): Node[] {
		const childrenNodes: Node[] = node.getChildren(this.sourceFile);
		const initialValue: Node[] = kinds.includes(node.kind) ? [node] : [];

		return childrenNodes.reduce((result: Node[], childNode: Node) => {
			return result.concat(this.findNodes(childNode, kinds));
		}, initialValue);
	}

}
