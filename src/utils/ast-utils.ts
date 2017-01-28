import * as ts from 'typescript';

export function printAllChildren(sourceFile: ts.SourceFile, node: ts.Node, depth = 0) {
	console.log(
		new Array(depth + 1).join('----'),
		`[${node.kind}]`,
		syntaxKindToName(node.kind),
		`[pos: ${node.pos}-${node.end}]`,
		':\t\t\t',
		node.getFullText(sourceFile).trim()
	);

	depth++;
	node.getChildren(sourceFile).forEach(childNode => printAllChildren(sourceFile, childNode, depth));
}

export function syntaxKindToName(kind: ts.SyntaxKind) {
	return ts.SyntaxKind[kind];
}
