export abstract class AbstractTemplateParser {

	/**
	 * Checks if file is of type javascript or typescript and
	 * makes the assumption that it is an Angular Component
	 */
	protected _isAngularComponent(filePath: string): boolean {
		return new RegExp('\.(ts|js)$', 'i').test(filePath);
	}

	/**
	 * Extracts inline template from components
	 */
	protected _extractInlineTemplate(contents: string): string {
		const match = new RegExp('template\\s?:\\s?(("|\'|`)(.|[\\r\\n])+?[^\\\\]\\2)').exec(contents);
		if (match !== null) {
			return match[1];
		}

		return '';
	}

	/**
	 * Angular's `[attr]="'val'"` syntax is not valid HTML,
	 * so it can't be parsed by standard HTML parsers.
	 * This method replaces `[attr]="'val'""` with `attr="val"`
	 */
	protected _normalizeTemplateAttributes(template: string): string {
		return template.replace(/\[(translate|ng2-translate)\]=("|')("|')([^\2]*)\3"/g, '$1="$4"');
	}

}
