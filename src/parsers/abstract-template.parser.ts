import {ParserInterface} from './parser.interface';
import {TranslationCollection} from '../utils/translation.collection';

export abstract class AbstractTemplateParser implements ParserInterface {

	public extract(contents: string, path?: string): TranslationCollection {
		if (path && this._isAngularComponent(path)) {
			contents = this._extractInlineTemplate(contents);
		}

		return this._parseTemplate(contents);
	}

	// usually overridden :-)
	protected _parseTemplate(contents: string) {
		return new TranslationCollection();
	}

	/**
	 * Checks if file is of type javascript or typescript and
	 * makes the assumption that it is an Angular Component
	 */
	protected _isAngularComponent(path: string): boolean {
		return (/\.ts|js$/i).test(path);
	}

	/**
	 * Extracts inline template from components
	 */
	protected _extractInlineTemplate(contents: string): string {
		const regExp: RegExp = /template\s*:\s*(["'`])([^\1]*?)\1/;
		const match = regExp.exec(contents);
		if (match !== null) {
			return match[2];
		}

		return '';
	}

}
