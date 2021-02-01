import { tsquery } from '@phenomnomnominal/tsquery';
import * as fs from 'fs';
import ts from 'typescript';
import { getNamedImportAlias, getTranslationNamespace } from './ast-helpers';

const NAMESPACE_MODULE_NAME = '@ngx-translate/core';
const TRANSLATION_NAMESPACE_NAME = 'TRANSLATION_NAMESPACE';

export function extractNamespace(source: string, filePath: string): string {
	let sourceFile: ts.SourceFile;
	// if html tries to get ts file where the namespace should be set
	if (filePath.endsWith('.html')) {
		try {
			const tsFilePath = filePath.replace('.html', '.ts');
			const tsFile = fs.readFileSync(tsFilePath, 'utf-8');
			sourceFile = tsquery.ast(tsFile, filePath);
		} catch (err) {
			throw new Error(`unable to load corresponding ts file for ${filePath} where namespace should be defined!`);
		}
	} else {
		sourceFile = tsquery.ast(source, filePath);
	}

	const translationNamespaceImportName = getNamedImportAlias(sourceFile, NAMESPACE_MODULE_NAME, TRANSLATION_NAMESPACE_NAME);
	if (!translationNamespaceImportName) {
		throw new Error(
			`"${TRANSLATION_NAMESPACE_NAME}" not imported in "${filePath}". Namespace has to be provided to component when using namespace translation service, pipe or directive from "${NAMESPACE_MODULE_NAME}"!!`
		);
	}

	const namespace = getTranslationNamespace(sourceFile, translationNamespaceImportName);

	if (!namespace || namespace === '') {
		throw new Error(
			`No ${TRANSLATION_NAMESPACE_NAME} provided in "${filePath}". Namespace has to be provided to component when using namespace translation service, pipe or directive from "${NAMESPACE_MODULE_NAME}"!!`
		);
	}

	return namespace;
}

/**
 * Assumes file is an Angular component if type is javascript/typescript
 */
export function isPathAngularComponent(path: string): boolean {
	return /\.ts|js$/i.test(path);
}

/**
 * Extract inline template from a component
 */
export function extractComponentInlineTemplate(contents: string): string {
	const regExp: RegExp = /template\s*:\s*(["'`])([^\1]*?)\1/;
	const match = regExp.exec(contents);
	if (match !== null) {
		return match[2];
	}
	return '';
}

export function stripBOM(contents: string): string {
	return contents.trim();
}
