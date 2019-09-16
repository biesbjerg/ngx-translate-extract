import { tsquery } from '@phenomnomnominal/tsquery';

import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { getNamedImportAlias, findFunctionCallExpressions, getStringsFromExpression } from '../utils/ast-helpers';

const MARKER_PACKAGE_MODULE_NAME = '@biesbjerg/ngx-translate-extract-marker';
const MARKER_PACKAGE_IMPORT_NAME = 'marker';

export class MarkerParser implements ParserInterface {

	public extract(contents: string, filePath: string): TranslationCollection | null {
		const sourceFile = tsquery.ast(contents, filePath);

		const markerFnName = getNamedImportAlias(sourceFile, MARKER_PACKAGE_MODULE_NAME, MARKER_PACKAGE_IMPORT_NAME);
		if (!markerFnName) {
			return;
		}

		let collection: TranslationCollection = new TranslationCollection();

		const callNodes = findFunctionCallExpressions(sourceFile, markerFnName);
		callNodes.forEach(callNode => {
			const [firstArgNode] = callNode.arguments;
			if (!firstArgNode) {
				return;
			}
			const strings = getStringsFromExpression(firstArgNode);
			collection = collection.addKeys(strings);
		});
		return collection;
	}

}
