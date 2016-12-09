import { ParserInterface } from './parsers/parser.interface';
import { PipeParser } from './parsers/pipe.parser';
import { DirectiveParser } from './parsers/directive.parser';
import { ServiceParser } from './parsers/service.parser';
import { SerializerInterface } from './serializers/serializer.interface';
import { StringCollection } from './utils/string.collection';

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

	public collection: StringCollection = new StringCollection();

	public constructor(public serializer: SerializerInterface) { }

	/**
	 * Process dir
	 */
	public process(dir: string): StringCollection {
		this._readDir(dir, this.patterns).forEach(path => {
			const contents: string = fs.readFileSync(path, 'utf-8');
			this.parsers.forEach((parser: ParserInterface) => {
				this.collection.merge(parser.extract(contents, path));
			});
		});

		return this.collection;
	}

	/**
	 * Serialize and return output
	 */
	public serialize(): string {
		return this.serializer.serialize(this.collection);
	}

	/**
	 * Serialize and save to destination
	 */
	public save(destination: string): string {
		const data = this.serialize();
		fs.writeFileSync(destination, data);
		return data;
	}

	/**
	 * Get all files in dir matching find patterns
	 */
	protected _readDir(dir: string, patterns: string[]): string[] {
		return patterns.reduce((results, pattern) => {
			return glob.sync(dir + pattern)
				.filter(path => fs.statSync(path).isFile())
				.concat(results);
		}, []);
	}

}
