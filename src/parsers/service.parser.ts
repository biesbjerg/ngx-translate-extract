import { tsquery } from '@phenomnomnominal/tsquery';

import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { findClasses, findClassPropertyByType, findMethodCallExpressions, getStringsFromExpression } from '../utils/ast-helpers';

const TRANSLATE_SERVICE_TYPE_REFERENCE = 'TranslateService';
const TRANSLATE_SERVICE_METHOD_NAMES = ['get', 'instant', 'stream'];

export class ServiceParser implements ParserInterface {

	public extract(source: string, filePath: string): TranslationCollection | null {
		const sourceFile = tsquery.ast(source, filePath);

		const classNodes = findClasses(sourceFile);
		if (!classNodes) {
			return;
		}

		let collection: TranslationCollection = new TranslationCollection();

		classNodes.forEach(classNode => {
			const propName: string = findClassPropertyByType(classNode, TRANSLATE_SERVICE_TYPE_REFERENCE);
			if (!propName) {
				return;
			}

			const callNodes = findMethodCallExpressions(classNode, propName, TRANSLATE_SERVICE_METHOD_NAMES);
			callNodes.forEach(callNode => {
				const [firstArgNode] = callNode.arguments;
				if (!firstArgNode) {
					return;
				}
				const strings = getStringsFromExpression(firstArgNode);
				collection = collection.addKeys(strings);
			});
		});
		return collection;
	}

}
