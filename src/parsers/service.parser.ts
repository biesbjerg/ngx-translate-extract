import {
	SourceFile,
	Node,
	ConstructorDeclaration,
	Identifier,
	TypeReferenceNode,
	ClassDeclaration,
	SyntaxKind,
	CallExpression,
	PropertyAccessExpression,
	isPropertyAccessExpression
} from 'typescript';

import { ParserInterface } from './parser.interface';
import { AbstractAstParser } from './abstract-ast.parser';
import { TranslationCollection } from '../utils/translation.collection';

export class ServiceParser extends AbstractAstParser implements ParserInterface {

	protected sourceFile: SourceFile;

	public extract(template: string, path: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		this.sourceFile = this.createSourceFile(path, template);
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
				const keys: string[] = this.getStringLiterals(callNode);
				if (keys && keys.length) {
					collection = collection.addKeys(keys, keys.map( key => { return { value: '', reference: path }; } ));
				}
			});
		});

		return collection;
	}

	/**
	 * Detect what the TranslateService instance property
	 * is called by inspecting constructor arguments
	 */
	protected findTranslateServicePropertyName(constructorNode: ConstructorDeclaration): string {
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
			const parameterType: Identifier = (parameter.type as TypeReferenceNode).typeName as Identifier;
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
			return (result.name as Identifier).text;
		}
	}

	/**
	 * Find class nodes
	 */
	protected findClassNodes(node: Node): ClassDeclaration[] {
		return this.findNodes(node, SyntaxKind.ClassDeclaration) as ClassDeclaration[];
	}

	/**
	 * Find constructor
	 */
	protected findConstructorNode(node: ClassDeclaration): ConstructorDeclaration {
		const constructorNodes = this.findNodes(node, SyntaxKind.Constructor) as ConstructorDeclaration[];
		if (constructorNodes) {
			return constructorNodes[0];
		}
	}

	/**
	 * Find all calls to TranslateService methods
	 */
	protected findCallNodes(node: Node, propertyIdentifier: string): CallExpression[] {
		let callNodes = this.findNodes(node, SyntaxKind.CallExpression) as CallExpression[];
		callNodes = callNodes
			.filter(callNode => {
				// Only call expressions with arguments
				if (callNode.arguments.length < 1) {
					return false;
				}

				const propAccess = callNode.getChildAt(0).getChildAt(0) as PropertyAccessExpression;
				if (!propAccess || !isPropertyAccessExpression(propAccess)) {
					return false;
				}
				if (!propAccess.getFirstToken() || propAccess.getFirstToken().kind !== SyntaxKind.ThisKeyword) {
					return false;
				}
				if (propAccess.name.text !== propertyIdentifier) {
					return false;
				}

				const methodAccess = callNode.getChildAt(0) as PropertyAccessExpression;
				if (!methodAccess || methodAccess.kind !== SyntaxKind.PropertyAccessExpression) {
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
