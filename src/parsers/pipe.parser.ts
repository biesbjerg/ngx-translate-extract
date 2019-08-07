import { ParserInterface, KeysPreprocessContextInterface } from './parser.interface';
import { AbstractPreprocessParser } from './abstract-preprocess.parser';
import { TranslationCollection } from '../utils/translation.collection';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils';
import { injectable } from 'inversify';

@injectable()
export class PipeParser extends AbstractPreprocessParser implements ParserInterface {

	public extract(template: string, path: string): TranslationCollection {
		if (path && isPathAngularComponent(path)) {
			template = extractComponentInlineTemplate(template);
		}

		return this.parseTemplate(template, path);
	}

	protected parseTemplate(template: string, path: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		const regExp: RegExp = /(['"`])((?:(?!\1).|\\\1)+)\1\s*\|\s*translate/g;
		let matches: RegExpExecArray;
		while (matches = regExp.exec(template)) {
			let keys = [matches[2].split('\\\'').join('\'')];
			let preprocessCtx: KeysPreprocessContextInterface = {
				template: template,
				path: path
			};
			collection = collection.add(this.preprocessKeys(keys, preprocessCtx)[0]);
		}

		return collection;
	}

}
