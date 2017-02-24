import * as ts from 'typescript';
export declare function printAllChildren(sourceFile: ts.SourceFile, node: ts.Node, depth?: number): void;
export declare function syntaxKindToName(kind: ts.SyntaxKind): string;
