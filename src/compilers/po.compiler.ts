import { CompilerInterface } from './compiler.interface';
import { TranslationCollection, TranslationData, TranslationType } from '../utils/translation.collection';

import * as gettext from 'gettext-parser';

export class PoCompiler implements CompilerInterface {

	public extension: string = 'po';

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
						extracted: data.comment ? data.comment : undefined,
						reference: data.reference ? data.reference : undefined
					}
				};

				if ( translations[ data.context ] ) {
					translations[ data.context ][ key ] = poData;
				} else {
					translations[ data.context ] = { [ key ]: poData };
				}

			} ); } );

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

		if ( Object.keys( po.translations ).length === 0 ) {
			return collection;
		}

		const values: TranslationType = {};

		Object.keys( po.translations ).forEach( contextKey => {
			Object.keys( po.translations[ contextKey ] ).forEach( key => {

				const poValue = po.translations[ contextKey ][ key ];
				const data: TranslationData = {
					value: poValue.msgstr.pop(),
					context: contextKey,
					reference: poValue.comments ? poValue.comments.reference : undefined,
					comment: poValue.comments ? poValue.comments.translator : undefined
				};

				TranslationCollection.assign( values, key, data );
			} );
		} );

		return new TranslationCollection(values);
	}

}
