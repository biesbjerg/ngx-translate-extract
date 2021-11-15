import { ClassDeclaration, CallExpression } from 'typescript';
import { ParserInterface } from './parser.interface.js';
import { TranslationCollection } from '../utils/translation.collection.js';
export declare class ServiceParser implements ParserInterface {
    extract(source: string, filePath: string): TranslationCollection | null;
    protected findConstructorParamCallExpressions(classDeclaration: ClassDeclaration): CallExpression[];
    protected findPropertyCallExpressions(classDeclaration: ClassDeclaration): CallExpression[];
}
