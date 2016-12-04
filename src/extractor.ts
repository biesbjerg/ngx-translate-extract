import { ParserInterface } from './parsers/parser.interface';
import { HtmlParser } from './parsers/html.parser';
import { TypescriptParser } from './parsers/typescript.parser';
import { SerializerInterface } from './serializers/serializer.interface';
import { PotSerializer } from './serializers/pot.serializer';

import * as lodash from 'lodash';
import * as glob from 'glob';
import * as fs from 'fs';

export interface TypeParserMap {
	[ext: string]: ParserInterface
}

export class Extractor {

	public parsers: TypeParserMap = {
		html: new HtmlParser(),
		ts: new TypescriptParser()
	};

	public globPatterns: string[] = [
		'/**/*.ts',
		'/**/*.html'
	];

	public messages: string[] = [];

	public constructor(public serializer: SerializerInterface) { }

	/**
	 * Extracts messages from paths
	 */
	public extract(dir: string): string[] {
		let messages = [];
		this.globPatterns.forEach(globPattern => {
			const filePaths = glob.sync(dir + globPattern);
			filePaths
				.filter(filePath => fs.statSync(filePath).isFile())
				.forEach(filePath => {
					const result = this._extractMessages(filePath);
					messages = [...messages, ...result];
				});
		});

		return this.messages = lodash.uniq(messages);
	}

	/**
	 * Serialize and return output
	 */
	public serialize(): string {
		return this.serializer.serialize(this.messages);
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
	 * Extract messages from file using specialized parser
	 */
	protected _extractMessages(filePath: string): string[] {
		const ext: string = filePath.split('.').pop();
		if (!this.parsers.hasOwnProperty(ext)) {
			return [];
		}

		const contents: string = fs.readFileSync(filePath, 'utf-8');
		const parser: ParserInterface = this.parsers[ext];

		return parser.process(contents);
	}

}