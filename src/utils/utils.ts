import * as pug from 'pug';

/**
 * Assumes file is an Angular component if type is javascript/typescript
 */
export function isPathAngularComponent(path: string): boolean {
	return /\.ts|js$/i.test(path);
}

export function pugConverterParser(source: string, filePath: string) {
	function isPathPugComponent(path: string): boolean {
		return /\.pug/i.test(path);
	}

	if (isPathPugComponent(filePath)) {
		return pug.renderFile(filePath);
	}
	return source;
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
