import { TranslationCollection } from '../utils/translation.collection';
import { CallExpression, ClassDeclaration, SourceFile } from 'typescript';
import { TmplAstElement } from '@angular/compiler';

export interface KeysPreprocessContextInterface {
	template: string;
	path: string;
	ctxObj?: {
		sourceFile?: SourceFile,
		classDeclaration?: ClassDeclaration,
		propertyName?: string,
		callExpression?: CallExpression,
		tmlAstElement?: TmplAstElement
		};
}

export interface ParserInterface {

	extract(template: string, path: string): TranslationCollection;

	preprocessKeys(key: string[], context: KeysPreprocessContextInterface): string[];
}

export interface ParserInterfaceWithConfig extends ParserInterface {
	config: any
}
