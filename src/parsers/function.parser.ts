import { Node, CallExpression, SyntaxKind, Identifier } from 'typescript';

import { KeysPreprocessContextInterface, ParserInterfaceWithConfig } from './parser.interface';
import { AbstractAstParser } from './abstract-ast.parser';
import { TranslationCollection } from '../utils/translation.collection';
import { injectable } from 'inversify';

@injectable()
export class FunctionParser extends AbstractAstParser implements ParserInterfaceWithConfig {

	protected functionIdentifier: string = 'marker';

	set config (opt: any) {
		if (opt && typeof opt.identifier !== 'undefined') {
			this.functionIdentifier = opt.identifier;
		}
	}

	get config() {
		return {
			identfier: this.functionIdentifier
		};
	}

	public extract(template: string, path: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		this.sourceFile = this.createSourceFile(path, template);

		const callNodes = this.findCallNodes();
		callNodes.forEach(callNode => {
			const keys: string[] = this.getStringLiterals(callNode);
			if (keys && keys.length) {
				let preprocessCtx: KeysPreprocessContextInterface = {
					template: template,
					path: path,
					ctxObj: {
						callExpression: callNode
					}
				};
				collection = collection.addKeys(this.preprocessKeys(keys, preprocessCtx));
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
