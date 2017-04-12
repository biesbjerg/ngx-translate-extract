import { ParserInterface } from './parser.interface';
import { AbstractAstParser } from './abstract-ast.parser';
import { TranslationCollection } from '../utils/translation.collection';
import * as ts from 'typescript';
export declare class ServiceParser extends AbstractAstParser implements ParserInterface {
    protected _sourceFile: ts.SourceFile;
    protected _instancePropertyName: any;
    protected _serviceClassName: string;
    protected _serviceMethodNames: string[];
    extract(contents: string, path?: string): TranslationCollection;
    protected _getInstancePropertyName(): string;
    protected _findConstructorNode(): ts.ConstructorDeclaration;
    protected _findCallNodes(node?: ts.Node): ts.CallExpression[];
}
