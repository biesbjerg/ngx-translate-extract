import { tsquery } from '@phenomnomnominal/tsquery';
import {
	SyntaxKind,
	Node,
	NamedImports,
	Identifier,
	ClassDeclaration,
	ConstructorDeclaration,
	isStringLiteralLike,
	isArrayLiteralExpression,
	CallExpression,
	Expression,
	isBinaryExpression,
	isConditionalExpression,
	PropertyAccessExpression,
	StringLiteral
} from 'typescript';

export function getNamedImports(node: Node, moduleName: string): NamedImports[] {
	const query = `ImportDeclaration[moduleSpecifier.text="${moduleName}"] NamedImports`;
	return tsquery<NamedImports>(node, query);
}

export function getNamedImportAlias(node: Node, moduleName: string, importName: string): string | null {
	const [namedImportNode] = getNamedImports(node, moduleName);
	if (!namedImportNode) {
		return null;
	}

	const query = `ImportSpecifier:has(Identifier[name="${importName}"]) > Identifier`;
	const identifiers = tsquery<Identifier>(namedImportNode, query);
	if (identifiers.length === 1) {
		return identifiers[0].text;
	}
	if (identifiers.length > 1) {
		return identifiers[identifiers.length - 1].text;
	}
	return null;
}

export function findClassDeclarations(node: Node): ClassDeclaration[] {
	const query = 'ClassDeclaration';
	return tsquery<ClassDeclaration>(node, query);
}

export function findClassPropertyByType(node: ClassDeclaration, type: string): string | null {
	return findClassPropertyConstructorParameterByType(node, type) || findClassPropertyDeclarationByType(node, type);
}

export function findConstructorDeclaration(node: ClassDeclaration): ConstructorDeclaration {
	const query = `Constructor`;
	const [result] = tsquery<ConstructorDeclaration>(node, query);
	return result;
}

export function findMethodParameterByType(node: Node, type: string): string | null {
	const query = `Parameter:has(TypeReference > Identifier[name="${type}"]) > Identifier`;
	const [result] = tsquery<Identifier>(node, query);
	if (result) {
		return result.text;
	}
	return null;
}

export function findMethodCallExpressions(node: Node, propName: string, fnName: string | string[]): CallExpression[] {
	if (Array.isArray(fnName)) {
		fnName = fnName.join('|');
	}
	const query = `CallExpression > PropertyAccessExpression:has(Identifier[name=/^(${fnName})$/]):has(PropertyAccessExpression:has(Identifier[name="${propName}"]):not(:has(ThisKeyword)))`;
	const nodes = tsquery<PropertyAccessExpression>(node, query).map((n) => n.parent as CallExpression);
	return nodes;
}

export function findClassPropertyConstructorParameterByType(node: ClassDeclaration, type: string): string | null {
	const query = `Constructor Parameter:has(TypeReference > Identifier[name="${type}"]):has(PublicKeyword,ProtectedKeyword,PrivateKeyword) > Identifier`;
	const [result] = tsquery<Identifier>(node, query);
	if (result) {
		return result.text;
	}
	return null;
}

export function findClassPropertyDeclarationByType(node: ClassDeclaration, type: string): string | null {
	const query = `PropertyDeclaration:has(TypeReference > Identifier[name="${type}"]) > Identifier`;
	const [result] = tsquery<Identifier>(node, query);
	if (result) {
		return result.text;
	}
	return null;
}

export function findFunctionCallExpressions(node: Node, fnName: string | string[]): CallExpression[] {
	if (Array.isArray(fnName)) {
		fnName = fnName.join('|');
	}
	const query = `CallExpression:has(Identifier[name="${fnName}"]):not(:has(PropertyAccessExpression))`;
	const nodes = tsquery<CallExpression>(node, query);
	return nodes;
}

export function findPropertyCallExpressions(node: Node, prop: string, fnName: string | string[]): CallExpression[] {
	if (Array.isArray(fnName)) {
		fnName = fnName.join('|');
	}
	const query = `CallExpression > PropertyAccessExpression:has(Identifier[name=/^(${fnName})$/]):has(PropertyAccessExpression:has(Identifier[name="${prop}"]):has(ThisKeyword))`;
	const nodes = tsquery<PropertyAccessExpression>(node, query).map((n) => n.parent as CallExpression);
	return nodes;
}

export function getStringsFromExpression(expression: Expression): string[] {
	if (isStringLiteralLike(expression)) {
		return [expression.text];
	}

	if (isArrayLiteralExpression(expression)) {
		return expression.elements.reduce((result: string[], element: Expression) => {
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

export function getTranslationNamespace(node: Node, translationNamespaceImportName: string) {
	const query = `ClassDeclaration > Decorator > CallExpression  ObjectLiteralExpression PropertyAssignment:has(Identifier[name='providers']) ArrayLiteralExpression ObjectLiteralExpression:has(PropertyAssignment:has(Identifier[name="${translationNamespaceImportName}"])) PropertyAssignment:has(Identifier[name="useValue"]) StringLiteral`;

	const [namespace] = tsquery<StringLiteral>(node, query);

	return namespace.text;
}
