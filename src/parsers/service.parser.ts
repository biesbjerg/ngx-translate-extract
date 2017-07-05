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
			const constructorNode = this._findConstructorNode(classNode);
			if (!constructorNode) {
				return;
			}

			const propertyName: string = this._findTranslateServicePropertyName(constructorNode);
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

	/**
	 * Detect what the TranslateService instance property
	 * is called by inspecting constructor arguments
	 */
	protected _findTranslateServicePropertyName(constructorNode: ts.ConstructorDeclaration): string {
		if (!constructorNode) {
			return null;
		}

		const result = constructorNode.parameters.find(parameter => {
			// Skip if visibility modifier is not present (we want it set as an instance property)
			if (!parameter.modifiers) {
				return false;
			}

			// Parameter has no type
			if (!parameter.type) {
				return false;
			}

			// Make sure className is of the correct type
			const parameterType: ts.Identifier = (parameter.type as ts.TypeReferenceNode).typeName as ts.Identifier;
			if (!parameterType) {
				return false;
			}
			const className: string = parameterType.text;
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
				if (!methodAccess.name || (methodAccess.name.text !== 'get' && methodAccess.name.text !== 'stream' && methodAccess.name.text !== 'instant')) {
					return false;
				}

				return true;
			});

		return callNodes;
	}

}
