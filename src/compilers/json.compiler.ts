import { CompilerInterface } from './compiler.interface';
import { TranslationCollection, TranslationData, TranslationType } from '../utils/translation.collection';
import { stripBOM } from '../utils/utils';

export class JsonCompiler implements CompilerInterface {

	public indentation: string = '\t';

	public extension: string = 'json';

	public constructor(options?: any) {
		if (options && typeof options.indentation !== 'undefined') {
			this.indentation = options.indentation;
		}
	}

	public compile(collection: TranslationCollection): string {

		const values: any = {};

		Object.keys( collection.values ).forEach( contextKey => {
			Object.keys( collection.values[ contextKey ] ).forEach( key => {

				const data: TranslationData = collection.values[ contextKey ][ key ];

				if ( contextKey.length === 0 ) {
					values[ key ] = data.value;
				} else {
					if ( values[ contextKey ] ) {
						values[ contextKey ][ key ] = data.value;
					} else {
						values[ contextKey ] = { [ key ]: data.value };
					}
				}
			} );
		});

		return JSON.stringify( values, null, this.indentation );
	}

	public parse(contents: string): TranslationCollection {

		const json = JSON.parse( stripBOM( contents ) );

		const values: TranslationType = {};

		Object.keys( json ).forEach( contextKey => {

			// Has context
			if ( typeof json[ contextKey ] === 'object' ) {
				Object.keys( json[ contextKey ] ).forEach( key => {
					TranslationCollection.assign( values, key, { value: json[ contextKey ][ key ], context: contextKey } );
				} );
			} else { // Doesn't have context
				TranslationCollection.assign( values, contextKey, { value: json[ contextKey ], context: '' } );
			}
		} );

		return new TranslationCollection( values );
	}
}
