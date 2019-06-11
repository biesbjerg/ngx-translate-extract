export abstract class AbstractTemplateParser {

	/**
	 * Checks if file is of type javascript or typescript and
	 * makes the assumption that it is an Angular Component
	 */
	protected isAngularComponent(path: string): boolean {
		return (/\.ts|js$/i).test(path);
	}

	/**
	 * Extracts inline template from components
	 */
	protected extractInlineTemplate(contents: string): string {
		const regExp: RegExp = /template\s*:\s*(["'`])([^\1]*?)\1/;
		const match = regExp.exec(contents);
		if (match !== null) {
			return match[2];
		}

		return '';
	}

}
