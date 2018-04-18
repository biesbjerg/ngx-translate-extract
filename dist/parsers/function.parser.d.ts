import { ParserInterface } from './parser.interface';
import { AbstractAstParser } from './abstract-ast.parser';
import { TranslationCollection } from '../utils/translation.collection';
import * as ts from 'typescript';
export declare class FunctionParser extends AbstractAstParser implements ParserInterface {
    protected _functionIdentifier: string;
    constructor(options?: any);
    extract(contents: string, path?: string): TranslationCollection;
    protected _findCallNodes(node?: ts.Node): ts.CallExpression[];
}
