import { Node, CallExpression, SyntaxKind, Identifier } from 'typescript';

import { ParserInterface } from './parser.interface';
import { AbstractAstParser } from './abstract-ast.parser';
import { TranslationCollection } from '../utils/translation.collection';

export class FunctionParser extends AbstractAstParser implements ParserInterface {

	protected functionIdentifier: string = 'marker';

	public constructor(options?: any) {
		super();
		if (options && typeof options.identifier !== 'undefined') {
			this.functionIdentifier = options.identifier;
		}
	}

	public extract(template: string, path: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		this.sourceFile = this.createSourceFile(path, template);

		const callNodes = this.findCallNodes();
		callNodes.forEach(callNode => {
			const keys: string[] = this.getStringLiterals(callNode);
			if (keys && keys.length) {
				collection = collection.addKeys(keys);
			}
		});
		return collection;
	}

	/**
	 * Find all calls to marker function
	 */
	protected findCallNodes(node?: Node): CallExpression[] {
		if (!node) {
			node = this.sourceFile;
		}

		let callNodes = this.findNodes(node, SyntaxKind.CallExpression) as CallExpression[];
		callNodes = callNodes
			.filter(callNode => {
				// Only call expressions with arguments
				if (callNode.arguments.length < 1) {
					return false;
				}

				const identifier = (callNode.getChildAt(0) as Identifier).text;
				if (identifier !== this.functionIdentifier) {
					return false;
				}

				return true;
			});

		return callNodes;
	}

}
