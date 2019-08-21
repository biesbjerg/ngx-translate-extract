import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils';

export class PipeParser implements ParserInterface {

	public extract(template: string, path: string): TranslationCollection {
		if (path && isPathAngularComponent(path)) {
			template = extractComponentInlineTemplate(template);
		}

		return this.parseTemplate(template, path);
	}

	protected parseTemplate(template: string, path: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		const regExp: RegExp = /(['"`])((?:(?!\1).|\\\1)+)\1\s*\|\s*translate(:.*:.*:?.*')?/g;
		let matches: RegExpExecArray;
		while (matches = regExp.exec(template)) {
			let context = '';
			let comment = null;

			if ( matches[ 3 ] ) {
             const splParams = matches[3].split(':');

             if ( splParams[ 2 ] ) {
             	context = splParams[2].slice( 1, splParams[2].length - 1 );
			 }

             if ( splParams[ 3 ] ) {
             	comment = splParams[3].slice( 1, splParams[3].length - 1 );
			 }
			}

			collection = collection.add(matches[2].split('\\\'').join('\''), { value: '', reference: path, context: context, comment: comment } );
		}

		return collection;
	}

}
