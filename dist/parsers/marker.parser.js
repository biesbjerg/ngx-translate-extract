import { tsquery } from '@phenomnomnominal/tsquery';
import { TranslationCollection } from '../utils/translation.collection.js';
import { getNamedImportAlias, findFunctionCallExpressions, getStringsFromExpression } from '../utils/ast-helpers.js';
const MARKER_MODULE_NAME = '@biesbjerg/ngx-translate-extract-marker';
const MARKER_IMPORT_NAME = 'marker';
export class MarkerParser {
    extract(source, filePath) {
        const sourceFile = tsquery.ast(source, filePath);
        const markerImportName = getNamedImportAlias(sourceFile, MARKER_MODULE_NAME, MARKER_IMPORT_NAME);
        if (!markerImportName) {
            return null;
        }
        let collection = new TranslationCollection();
        const callExpressions = findFunctionCallExpressions(sourceFile, markerImportName);
        callExpressions.forEach((callExpression) => {
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
//# sourceMappingURL=marker.parser.js.map