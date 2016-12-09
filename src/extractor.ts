import { ParserInterface } from './parsers/parser.interface';
import { PipeParser } from './parsers/pipe.parser';
import { DirectiveParser } from './parsers/directive.parser';
import { ServiceParser } from './parsers/service.parser';
import { TranslationCollection } from './utils/translation.collection';

import * as glob from 'glob';
import * as fs from 'fs';

export class Extractor {

	public patterns: string[] = [
		'/**/*.html',
		'/**/*.ts',
		'/**/*.js'
	];

	public parsers: ParserInterface[] = [
		new PipeParser(),
		new DirectiveParser(),
		new ServiceParser()
	];

	/**
	 * Extract strings from dir
	 */
	public process(dir: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		this._readDir(dir, this.patterns).forEach(path => {
			const contents: string = fs.readFileSync(path, 'utf-8');
			this.parsers.forEach((parser: ParserInterface) => {
				collection = collection.union(parser.extract(contents, path));
			});
		});

		return collection;
	}

	/**
	 * Get all files in dir matching patterns
	 */
	protected _readDir(dir: string, patterns: string[]): string[] {
		return patterns.reduce((results, pattern) => {
			return glob.sync(dir + pattern)
				.filter(path => fs.statSync(path).isFile())
				.concat(results);
		}, []);
	}

}
