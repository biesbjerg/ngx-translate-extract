import { ParserInterface } from './parser.interface';
import { AbstractAstParser } from './abstract-ast.parser';
import { TranslationCollection } from '../utils/translation.collection';
import * as ts from 'typescript';
export declare class ServiceParser extends AbstractAstParser implements ParserInterface {
    protected _sourceFile: ts.SourceFile;
    extract(contents: string, path?: string): TranslationCollection;
    protected _findTranslateServicePropertyName(constructorNode: ts.ConstructorDeclaration): string;
    protected _findClassNodes(node: ts.Node): ts.ClassDeclaration[];
    protected _findConstructorNode(node: ts.ClassDeclaration): ts.ConstructorDeclaration;
    protected _findCallNodes(node: ts.Node, propertyIdentifier: string): ts.CallExpression[];
}
