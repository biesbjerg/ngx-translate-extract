import { ParserInterface } from './parser.interface';
import { AbstractAstParser } from './abstract-ast.parser';
import { TranslationCollection } from '../utils/translation.collection';

import * as ts from 'typescript';

export class ServiceParser extends AbstractAstParser implements ParserInterface {

	protected sourceFile: ts.SourceFile;

	public extract(contents: string, path?: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		this.sourceFile = this.createSourceFile(path, contents);
		const classNodes = this.findClassNodes(this.sourceFile);
		classNodes.forEach(classNode => {
			const constructorNode = this.findConstructorNode(classNode);
			if (!constructorNode) {
				return;
			}

			const propertyName: string = this.findTranslateServicePropertyName(constructorNode);
			if (!propertyName) {
				return;
			}

			const callNodes = this.findCallNodes(classNode, propertyName);
			callNodes.forEach(callNode => {
				const keys: string[] = this.getCallArgStrings(callNode);
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
	protected findTranslateServicePropertyName(constructorNode: ts.ConstructorDeclaration): string {
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
	protected findClassNodes(node: ts.Node): ts.ClassDeclaration[] {
		return this.findNodes(node, ts.SyntaxKind.ClassDeclaration) as ts.ClassDeclaration[];
	}

	/**
	 * Find constructor
	 */
	protected findConstructorNode(node: ts.ClassDeclaration): ts.ConstructorDeclaration {
		const constructorNodes = this.findNodes(node, ts.SyntaxKind.Constructor) as ts.ConstructorDeclaration[];
		if (constructorNodes) {
			return constructorNodes[0];
		}
	}

	/**
	 * Find all calls to TranslateService methods
	 */
	protected findCallNodes(node: ts.Node, propertyIdentifier: string): ts.CallExpression[] {
		let callNodes = this.findNodes(node, ts.SyntaxKind.CallExpression) as ts.CallExpression[];
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
