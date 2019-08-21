import { CompilerInterface } from './compiler.interface';
import { TranslationCollection, TranslationData, TranslationType } from '../utils/translation.collection';

import * as gettext from 'gettext-parser';

export class PoCompiler implements CompilerInterface {

	public extension: string = 'po';

	/**
	 * Translation domain
	 */
	public domain: string = '';

	public constructor(options?: any) {}

	public compile(collection: TranslationCollection): string {

		const translations: any = {};

		Object.keys(collection.values).forEach( contextKey => {
			Object.keys( collection.values[ contextKey ] ).forEach( key => {

				const data: TranslationData = collection.values[ contextKey ][ key ];
				const poData: any = {
					msgid: key,
					msgstr: data.value,
					msgctxt: data.context ? data.context : undefined,
					comments: {
						translator: data.comment ? data.comment : undefined,
						reference: data.reference ? data.reference : undefined
					}
				};

				if ( translations[ data.context ] ) {
					translations[ data.context ][ key ] = poData;
				} else {
					translations[ data.context ] = { [ key ]: poData };
				}

			} ); } );

		//console.log( collection.values[''] );

		const data = {
			charset: 'utf-8',
			headers: {
				'mime-version': '1.0',
				'content-type': 'text/plain; charset=utf-8',
				'content-transfer-encoding': '8bit'
			},
			translations
		};

		return gettext.po.compile(data);
	}

	public parse(contents: string): TranslationCollection {
		const collection = new TranslationCollection();

		const po = gettext.po.parse(contents, 'utf8');
		if (!po.translations.hasOwnProperty(this.domain)) {
			return collection;
		}

		const values = Object.keys(po.translations[this.domain])
			.filter(key => key.length > 0)
			.reduce((values, key) => {
				values[key] = po.translations[this.domain][key].msgstr.pop();
				return values;
			}, {} as TranslationType);

		return new TranslationCollection(values);
	}

}
