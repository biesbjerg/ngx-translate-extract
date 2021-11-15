import { tsquery } from '@phenomnomnominal/tsquery';
import { TranslationCollection } from '../utils/translation.collection.js';
import { findClassDeclarations, findClassPropertyByType, findPropertyCallExpressions, findMethodCallExpressions, getStringsFromExpression, findMethodParameterByType, findConstructorDeclaration } from '../utils/ast-helpers.js';
const TRANSLATE_SERVICE_TYPE_REFERENCE = 'TranslateService';
const TRANSLATE_SERVICE_METHOD_NAMES = ['get', 'instant', 'stream'];
export class ServiceParser {
    extract(source, filePath) {
        const sourceFile = tsquery.ast(source, filePath);
        const classDeclarations = findClassDeclarations(sourceFile);
        if (!classDeclarations) {
            return null;
        }
        let collection = new TranslationCollection();
        classDeclarations.forEach((classDeclaration) => {
            const callExpressions = [
                ...this.findConstructorParamCallExpressions(classDeclaration),
                ...this.findPropertyCallExpressions(classDeclaration)
            ];
            callExpressions.forEach((callExpression) => {
                const [firstArg] = callExpression.arguments;
                if (!firstArg) {
                    return;
                }
                const strings = getStringsFromExpression(firstArg);
                collection = collection.addKeys(strings);
            });
        });
        return collection;
    }
    findConstructorParamCallExpressions(classDeclaration) {
        const constructorDeclaration = findConstructorDeclaration(classDeclaration);
        if (!constructorDeclaration) {
            return [];
        }
        const paramName = findMethodParameterByType(constructorDeclaration, TRANSLATE_SERVICE_TYPE_REFERENCE);
        return findMethodCallExpressions(constructorDeclaration, paramName, TRANSLATE_SERVICE_METHOD_NAMES);
    }
    findPropertyCallExpressions(classDeclaration) {
        const propName = findClassPropertyByType(classDeclaration, TRANSLATE_SERVICE_TYPE_REFERENCE);
        if (!propName) {
            return [];
        }
        return findPropertyCallExpressions(classDeclaration, propName, TRANSLATE_SERVICE_METHOD_NAMES);
    }
}
//# sourceMappingURL=service.parser.js.map