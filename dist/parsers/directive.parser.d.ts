import { TmplAstNode as Node, TmplAstElement as Element, TmplAstText as Text, TmplAstTemplate as Template, TmplAstTextAttribute as TextAttribute, TmplAstBoundAttribute as BoundAttribute, AST, LiteralPrimitive } from '@angular/compiler';
import { ParserInterface } from './parser.interface.js';
import { TranslationCollection } from '../utils/translation.collection.js';
declare type ElementLike = Element | Template;
export declare class DirectiveParser implements ParserInterface {
    extract(source: string, filePath: string): TranslationCollection | null;
    protected getElementsWithTranslateAttribute(nodes: Node[]): ElementLike[];
    protected getTextNodes(element: ElementLike): Text[];
    protected hasAttribute(element: ElementLike, name: string): boolean;
    protected getAttribute(element: ElementLike, name: string): TextAttribute;
    protected hasBoundAttribute(element: ElementLike, name: string): boolean;
    protected getBoundAttribute(element: ElementLike, name: string): BoundAttribute;
    protected getLiteralPrimitives(exp: AST): LiteralPrimitive[];
    protected isElementLike(node: Node): node is ElementLike;
    protected isText(node: Node): node is Text;
    protected parseTemplate(template: string, path: string): Node[];
}
export {};
