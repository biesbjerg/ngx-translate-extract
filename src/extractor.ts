import { ParserInterface } from './parsers/parser.interface';
import { PipeParser } from './parsers/pipe.parser';
import { DirectiveParser } from "./parsers/directive.parser";
import { ServiceParser } from './parsers/service.parser';
import { SerializerInterface } from './serializers/serializer.interface';

import * as lodash from 'lodash';
import * as glob from 'glob';
import * as fs from 'fs';

export class Extractor {

	public parsers: ParserInterface[] = [
		new PipeParser(),
		new ServiceParser(),
		new DirectiveParser()
	];

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
		let results = [];

		const contents: string = fs.readFileSync(filePath, 'utf-8');
		this.parsers.forEach((parser: ParserInterface) => {
			results = results.concat(parser.process(contents));
		});

		return results;
	}

}