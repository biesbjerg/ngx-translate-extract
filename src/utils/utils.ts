export function _(key: string | string[]): string | string[] {
	return key;
}

/**
 * Assumes file is an Angular component if type is javascript/typescript
 */
export function isPathAngularComponent(path: string): boolean {
	return (/\.ts|js$/i).test(path);
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
