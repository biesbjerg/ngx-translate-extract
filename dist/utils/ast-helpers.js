import { tsquery } from '@phenomnomnominal/tsquery';
import pkg from 'typescript';
const { SyntaxKind, isStringLiteralLike, isArrayLiteralExpression, isBinaryExpression, isConditionalExpression } = pkg;
export function getNamedImports(node, moduleName) {
    const query = `ImportDeclaration[moduleSpecifier.text="${moduleName}"] NamedImports`;
    return tsquery(node, query);
}
export function getNamedImportAlias(node, moduleName, importName) {
    const [namedImportNode] = getNamedImports(node, moduleName);
    if (!namedImportNode) {
        return null;
    }
    const query = `ImportSpecifier:has(Identifier[name="${importName}"]) > Identifier`;
    const identifiers = tsquery(namedImportNode, query);
    if (identifiers.length === 1) {
        return identifiers[0].text;
    }
    if (identifiers.length > 1) {
        return identifiers[identifiers.length - 1].text;
    }
    return null;
}
export function findClassDeclarations(node) {
    const query = 'ClassDeclaration';
    return tsquery(node, query);
}
export function findClassPropertyByType(node, type) {
    return findClassPropertyConstructorParameterByType(node, type) || findClassPropertyDeclarationByType(node, type);
}
export function findConstructorDeclaration(node) {
    const query = `Constructor`;
    const [result] = tsquery(node, query);
    return result;
}
export function findMethodParameterByType(node, type) {
    const query = `Parameter:has(TypeReference > Identifier[name="${type}"]) > Identifier`;
    const [result] = tsquery(node, query);
    if (result) {
        return result.text;
    }
    return null;
}
export function findMethodCallExpressions(node, propName, fnName) {
    if (Array.isArray(fnName)) {
        fnName = fnName.join('|');
    }
    const query = `CallExpression > PropertyAccessExpression:has(Identifier[name=/^(${fnName})$/]):has(PropertyAccessExpression:has(Identifier[name="${propName}"]):not(:has(ThisKeyword)))`;
    const nodes = tsquery(node, query).map((n) => n.parent);
    return nodes;
}
export function findClassPropertyConstructorParameterByType(node, type) {
    const query = `Constructor Parameter:has(TypeReference > Identifier[name="${type}"]):has(PublicKeyword,ProtectedKeyword,PrivateKeyword) > Identifier`;
    const [result] = tsquery(node, query);
    if (result) {
        return result.text;
    }
    return null;
}
export function findClassPropertyDeclarationByType(node, type) {
    const query = `PropertyDeclaration:has(TypeReference > Identifier[name="${type}"]) > Identifier`;
    const [result] = tsquery(node, query);
    if (result) {
        return result.text;
    }
    return null;
}
export function findFunctionCallExpressions(node, fnName) {
    if (Array.isArray(fnName)) {
        fnName = fnName.join('|');
    }
    const query = `CallExpression:has(Identifier[name="${fnName}"]):not(:has(PropertyAccessExpression))`;
    const nodes = tsquery(node, query);
    return nodes;
}
export function findPropertyCallExpressions(node, prop, fnName) {
    if (Array.isArray(fnName)) {
        fnName = fnName.join('|');
    }
    const query = `CallExpression > PropertyAccessExpression:has(Identifier[name=/^(${fnName})$/]):has(PropertyAccessExpression:has(Identifier[name="${prop}"]):has(ThisKeyword))`;
    const nodes = tsquery(node, query).map((n) => n.parent);
    return nodes;
}
export function getStringsFromExpression(expression) {
    if (isStringLiteralLike(expression)) {
        return [expression.text];
    }
    if (isArrayLiteralExpression(expression)) {
        return expression.elements.reduce((result, element) => {
            const strings = getStringsFromExpression(element);
            return [...result, ...strings];
        }, []);
    }
    if (isBinaryExpression(expression)) {
        const [left] = getStringsFromExpression(expression.left);
        const [right] = getStringsFromExpression(expression.right);
        if (expression.operatorToken.kind === SyntaxKind.PlusToken) {
            if (typeof left === 'string' && typeof right === 'string') {
                return [left + right];
            }
        }
        if (expression.operatorToken.kind === SyntaxKind.BarBarToken) {
            const result = [];
            if (typeof left === 'string') {
                result.push(left);
            }
            if (typeof right === 'string') {
                result.push(right);
            }
            return result;
        }
    }
    if (isConditionalExpression(expression)) {
        const [whenTrue] = getStringsFromExpression(expression.whenTrue);
        const [whenFalse] = getStringsFromExpression(expression.whenFalse);
        const result = [];
        if (typeof whenTrue === 'string') {
            result.push(whenTrue);
        }
        if (typeof whenFalse === 'string') {
            result.push(whenFalse);
        }
        return result;
    }
    return [];
}
//# sourceMappingURL=ast-helpers.js.map