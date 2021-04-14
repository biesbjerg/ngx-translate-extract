import { ClassDeclaration, CallExpression } from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';

import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import {
	findClassDeclarations,
	findClassPropertyByType,
	findPropertyCallExpressions,
	findMethodCallExpressions,
	getStringsFromExpression,
	findMethodParameterByType,
	findConstructorDeclaration
} from '../utils/ast-helpers';

const DEFAULT_TRANSLATE_SERVICE_TYPE_REFERENCE = 'TranslateService';
const DEFAULT_TRANSLATE_SERVICE_METHOD_NAMES = ['get', 'instant', 'stream'];

export class ServiceParser implements ParserInterface {
	constructor(private readonly serviceName?: string, private readonly serviceMethodNames?: string[]) {
		this.serviceName = serviceName || DEFAULT_TRANSLATE_SERVICE_TYPE_REFERENCE;
		this.serviceMethodNames = serviceMethodNames && serviceMethodNames.length ? serviceMethodNames : DEFAULT_TRANSLATE_SERVICE_METHOD_NAMES;
	}

	public extract(source: string, filePath: string): TranslationCollection | null {
		const sourceFile = tsquery.ast(source, filePath);

		const classDeclarations = findClassDeclarations(sourceFile);
		if (!classDeclarations) {
			return null;
		}

		let collection: TranslationCollection = new TranslationCollection();

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

	protected findConstructorParamCallExpressions(classDeclaration: ClassDeclaration): CallExpression[] {
		const constructorDeclaration = findConstructorDeclaration(classDeclaration);
		if (!constructorDeclaration) {
			return [];
		}
		const paramName = findMethodParameterByType(constructorDeclaration, this.serviceName);
		return findMethodCallExpressions(constructorDeclaration, paramName, this.serviceMethodNames);
	}

	protected findPropertyCallExpressions(classDeclaration: ClassDeclaration): CallExpression[] {
		const propName: string = findClassPropertyByType(classDeclaration, this.serviceName);
		if (!propName) {
			return [];
		}
		return findPropertyCallExpressions(classDeclaration, propName, this.serviceMethodNames);
	}
}
