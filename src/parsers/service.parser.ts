import { ParserInterface } from './parser.interface';
import { AbstractAstParser } from './abstract-ast.parser';
import { TranslationCollection } from '../utils/translation.collection';

import * as ts from 'typescript';

export class ServiceParser extends AbstractAstParser implements ParserInterface {

	protected _sourceFile: ts.SourceFile;

	public extract(contents: string, path?: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		this._sourceFile = this._createSourceFile(path, contents);
		const classNodes = this._findClassNodes(this._sourceFile);
		classNodes.forEach(classNode => {

			const propertyName = this._findTranslateServicePropertyName(classNode);
			if (!propertyName) {
				return;
			}

			const callNodes = this._findCallNodes(classNode, propertyName);
			callNodes.forEach(callNode => {
				const keys: string[] = this._getCallArgStrings(callNode);
				if (keys && keys.length) {
					collection = collection.addKeys(keys);
				}
			});
		});

		return collection;
	}

	protected _findTranslateServicePropertyName(classNode: ts.ClassDeclaration): string {
		return this._findPropertyNameInConstructor(classNode) || this._findPropertyNameInFields(classNode);
	}

	/**
	 * Detect if TranslateService is injected in constructor, and if so retrieves its name
	 */
	protected _findPropertyNameInConstructor(classNode: ts.ClassDeclaration): string {
		const constructorNode = this._findConstructorNode(classNode);
		if (!constructorNode) {
			return;
		}

		return this._findPropertyNameInDeclarations(constructorNode.parameters);
	}

	/**
	 * Detect if TranslateService is in class properties, and if so retrieves its name
	 */
	protected _findPropertyNameInFields(classNode: ts.ClassDeclaration): string {
		const propertyNodes = this._findNodes(classNode, ts.SyntaxKind.PropertyDeclaration) as ts.PropertyDeclaration[];
		return this._findPropertyNameInDeclarations(propertyNodes);
	}

	protected _findPropertyNameInDeclarations(declarations: (ts.ParameterDeclaration | ts.PropertyDeclaration)[]): string {
		const result = declarations.find(declaration => {
			// Skip if visibility modifier is not present (we want it set as an instance property)
			if (!declaration.modifiers) {
				return false;
			}

			// Parameter has no type
			if (!declaration.type) {
				return false;
			}

			// Make sure className is of the correct type
			const declarationType: ts.Identifier = (declaration.type as ts.TypeReferenceNode).typeName as ts.Identifier;
			if (!declarationType) {
				return false;
			}
			const className: string = declarationType.text;
			if (className !== 'TranslateService') {
				return false;
			}

			return true;
		});

		if (result) {
			return (result.name as ts.Identifier).text;
		}
	}

	/**
	 * Find class nodes
	 */
	protected _findClassNodes(node: ts.Node): ts.ClassDeclaration[] {
		return this._findNodes(node, ts.SyntaxKind.ClassDeclaration) as ts.ClassDeclaration[];
	}

	/**
	 * Find constructor
	 */
	protected _findConstructorNode(node: ts.ClassDeclaration): ts.ConstructorDeclaration {
		const constructorNodes = this._findNodes(node, ts.SyntaxKind.Constructor) as ts.ConstructorDeclaration[];
		if (constructorNodes) {
			return constructorNodes[0];
		}
	}

	/**
	 * Find all calls to TranslateService methods
	 */
	protected _findCallNodes(node: ts.Node, propertyIdentifier: string): ts.CallExpression[] {
		let callNodes = this._findNodes(node, ts.SyntaxKind.CallExpression) as ts.CallExpression[];
		callNodes = callNodes
			.filter(callNode => {
				// Only call expressions with arguments
				if (callNode.arguments.length < 1) {
					return false;
				}

				const propAccess = callNode.getChildAt(0).getChildAt(0) as ts.PropertyAccessExpression;
				if (!propAccess || propAccess.kind !== ts.SyntaxKind.PropertyAccessExpression) {
					return false;
				}
				if (!propAccess.getFirstToken() || propAccess.getFirstToken().kind !== ts.SyntaxKind.ThisKeyword) {
					return false;
				}
				if (propAccess.name.text !== propertyIdentifier) {
					return false;
				}

				const methodAccess = callNode.getChildAt(0) as ts.PropertyAccessExpression;
				if (!methodAccess || methodAccess.kind !== ts.SyntaxKind.PropertyAccessExpression) {
					return false;
				}
				if (!methodAccess.name || (methodAccess.name.text !== 'get' && methodAccess.name.text !== 'instant' && methodAccess.name.text !== 'stream')) {
					return false;
				}

				return true;
			});

		return callNodes;
	}

}
