import { tsquery } from '@phenomnomnominal/tsquery';

import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { getNamedImportAlias, findFunctionCallExpressions, getStringsFromExpression } from '../utils/ast-helpers';

const MARKER_MODULE_NAME = '@biesbjerg/ngx-translate-extract-marker';
const MARKER_IMPORT_NAME = 'marker';

export class MarkerParser implements ParserInterface {

	public extract(source: string, filePath: string): TranslationCollection | null {
		const sourceFile = tsquery.ast(source, filePath);

		const markerImportName = getNamedImportAlias(sourceFile, MARKER_MODULE_NAME, MARKER_IMPORT_NAME);
		if (!markerImportName) {
			return null;
		}

		let collection: TranslationCollection = new TranslationCollection();

		const callExpressions = findFunctionCallExpressions(sourceFile, markerImportName);
		callExpressions.forEach(callExpression => {
			const [firstArg] = callExpression.arguments;
			if (!firstArg) {
				return;
			}
			const strings = getStringsFromExpression(firstArg);
			collection = collection.addKeys(strings);
		});
		return collection;
	}

}
