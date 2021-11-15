import { AST, TmplAstNode, BindingPipe, LiteralPrimitive, Conditional } from '@angular/compiler';
import { ParserInterface } from './parser.interface.js';
import { TranslationCollection } from '../utils/translation.collection.js';
export declare class PipeParser implements ParserInterface {
    extract(source: string, filePath: string): TranslationCollection | null;
    protected findPipesInNode(node: any): BindingPipe[];
    protected parseTranslationKeysFromPipe(pipeContent: BindingPipe | LiteralPrimitive | Conditional): string[];
    protected getTranslatablesFromAst(ast: AST): BindingPipe[];
    protected getTranslatablesFromAsts(asts: AST[]): BindingPipe[];
    protected flatten<T extends AST>(array: T[][]): T[];
    protected expressionIsOrHasBindingPipe(exp: any): exp is BindingPipe;
    protected parseTemplate(template: string, path: string): TmplAstNode[];
}
