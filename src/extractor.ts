import { ParserInterface } from './parsers/parser.interface';
import { HtmlParser } from './parsers/html.parser';
import { TypescriptParser } from './parsers/typescript.parser';
import { SerializerInterface } from './serializers/serializer.interface';
import { PotSerializer } from './serializers/pot.serializer';

import { uniq as arrayUnique } from 'lodash';
import { sync as readDir } from 'glob';
import { readFileSync as readFile, writeFileSync as writeFile } from 'fs';

export interface TypeParserMap {
	[ext: string]: ParserInterface
}

export class Extractor {

	public messages: string[] = [];

	public parsers: TypeParserMap = {
		html: new HtmlParser(),
		ts: new TypescriptParser()
	};

	public constructor(public serializer: SerializerInterface) { }

	/**
	 * Extracts messages from paths
	 */
	public extract(paths: string[]): string[] {
		let messages = [];
		paths.forEach(path => {
			const filePaths = readDir(path);
			filePaths.forEach(filePath => {
				const result = this._extractMessages(filePath);
				messages = [...messages, ...result];
			});
		});

		return this.messages = arrayUnique(messages);
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
		writeFile(destination, data);

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

		const contents: string = readFile(filePath).toString();
		const parser: ParserInterface = this.parsers[ext];

		return parser.process(contents);
	}

}