export abstract class AbstractTemplateParser {

	/**
	 * Checks if file is of type javascript or typescript and
	 * makes the assumption that it is an Angular Component
	 */
	protected _isAngularComponent(path: string): boolean {
		return new RegExp(/\.ts|js$/, 'i').test(path);
	}

	/**
	 * Extracts inline template from components
	 */
	protected _extractInlineTemplate(contents: string): string {
		const match = new RegExp(/template\s*:\s*(["'`])((.|[\r\n])+?[^\\])\1/).exec(contents);
		if (match !== null) {
			return match[2];
		}

		return '';
	}

	/**
	 * Angular's `[attr]="'val'"` syntax is not valid HTML,
	 * so it can't be parsed by standard HTML parsers.
	 * This method replaces `[attr]="'val'""` with `attr="val"`
	 */
	protected _normalizeTemplateAttributes(template: string): string {
		return template.replace(/\[([^\]]+)\]="'([^']*)'"/g, '$1="$2"');
	}

}
