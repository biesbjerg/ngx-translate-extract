import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';

export class ServiceParser implements ParserInterface {

	public extract(contents: string, path?: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		const translateServiceVar = this._extractTranslateServiceVar(contents);
		if (!translateServiceVar && contents.indexOf('//translate') === -1) {
			return collection;
		}

		let methodRegExp: RegExp = /(?:get|instant)\s*\(\s*(\[?\s*(['"`])([^\1\r\n]*)\2\s*\]?)/;
		let regExp: RegExp = new RegExp(`\\.${translateServiceVar}\\.${methodRegExp.source}`, 'g');

		let matches: RegExpExecArray;
        let matche: any;
        if (translateServiceVar){
			while (matches = regExp.exec(contents)) {
				if (this._stringContainsArray(matches[1])) {
					collection = collection.addKeys(this._stringToArray(matches[1]));
				} else {
					collection = collection.add(matches[3]);
				}
			}
		}
        contents = contents
        .replace(new RegExp("''", 'g'), "\"DBL_ONE_QUOTED\"")
        .replace(new RegExp('""', 'g'), "\"DBL_TWO_QUOTED\"");
        methodRegExp = /(?:'|")(.*?)\/\/translate/;
        regExp = new RegExp(methodRegExp.source, 'g');
        while (matches = regExp.exec(contents)) {
          matche = matches[1].trim();
          if (",;:+".indexOf(matche[matche.length-1])!==-1){
            matche = matche.substr(0,matche.length-1);
          }
          matche = matche.substr(0,matche.length-1);
          matche = matche
          .replace(new RegExp("\"DBL_ONE_QUOTED\"", 'g'), "''")
          .replace(new RegExp("\"DBL_TWO_QUOTED\"", 'g'), '""')
          collection = collection.add(matche);
        }

		return collection;
	}

	/**
	 * Extracts name of TranslateService variable for use in patterns
	 */
	protected _extractTranslateServiceVar(contents: string): string {
		const matches = contents.match(/([a-z0-9_]+)\s*:\s*TranslateService/i);
		if (matches === null) {
			return '';
		}

		return matches[1];
	}

	/**
	 * Checks if string contains an array
	 */
	protected _stringContainsArray(input: string): boolean {
		return input.startsWith('[') && input.endsWith(']');
	}

	/**
	 * Converts string to array
	 */
	protected _stringToArray(input: string): string[] {
		if (this._stringContainsArray(input)) {
			return eval(input);
		}

		return [];
	}

}
