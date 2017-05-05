import { ParserInterface } from './parser.interface';
import { AbstractAstParser } from './abstract-ast.parser';
import { TranslationCollection } from '../utils/translation.collection';

import * as ts from 'typescript';

export class ServiceParser extends AbstractAstParser implements ParserInterface {

	protected _sourceFile: ts.SourceFile;

	protected _instancePropertyName: any;
	protected _serviceClassName: string = 'TranslateService';
	protected _serviceMethodNames: string[] = ['get', 'instant'];

	public extract(contents: string, path?: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		this._sourceFile = this._createSourceFile(path, contents);

		this._instancePropertyName = this._getInstancePropertyName();
		if (!this._instancePropertyName) {
			return collection;
		}

		const callNodes = this._findCallNodes();
		callNodes.forEach(callNode => {
			const keys: string[] = this._getCallArgStrings(callNode);
			if (keys && keys.length) {
				collection = collection.addKeys(keys);
			}
		});

		return collection;
	}

	/**
	 * Detect what the TranslateService instance property
	 * is called by inspecting constructor params
	 */
	protected _getInstancePropertyName(): string {
		const constructorNode = this._findConstructorNode();
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
			if (className !== this._serviceClassName) {
				return false;
			}

			return true;
		});

		if (result) {
			return (result.name as ts.Identifier).text;
		}
	}

	/**
	 * Find first constructor
	 */
	protected _findConstructorNode(): ts.ConstructorDeclaration {
		const constructors = this._findNodes(this._sourceFile, ts.SyntaxKind.Constructor, true) as ts.ConstructorDeclaration[];
		if (constructors.length) {
			return constructors[0];
		}
	}

	/**
	 * Find all calls to TranslateService methods
	 */
	protected _findCallNodes(node?: ts.Node): ts.CallExpression[] {
		if (!node) {
			node = this._sourceFile;
		}

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
				if (propAccess.name.text !== this._instancePropertyName) {
					return false;
				}

				const methodAccess = callNode.getChildAt(0) as ts.PropertyAccessExpression;
				if (!methodAccess || methodAccess.kind !== ts.SyntaxKind.PropertyAccessExpression) {
					return false;
				}
				if (!methodAccess.name || this._serviceMethodNames.indexOf(methodAccess.name.text) === -1) {
					return false;
				}

				return true;
			});

		return callNodes;
	}

}
