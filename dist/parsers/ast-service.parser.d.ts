import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import * as ts from 'typescript';
export declare class AstServiceParser implements ParserInterface {
    protected _sourceFile: ts.SourceFile;
    protected _instancePropertyName: any;
    protected _serviceClassName: string;
    protected _serviceMethodNames: string[];
    extract(contents: string, path?: string): TranslationCollection;
    protected _createSourceFile(path: string, contents: string): ts.SourceFile;
    protected _getInstancePropertyName(): string;
    protected _findConstructorNode(): ts.ConstructorDeclaration;
    protected _findCallNodes(node?: ts.Node): ts.CallExpression[];
    protected _getCallArgStrings(callNode: ts.CallExpression): string[];
    protected _findNodes(node: ts.Node, kind: ts.SyntaxKind, onlyOne?: boolean): ts.Node[];
}
