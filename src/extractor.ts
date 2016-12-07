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
		new DirectiveParser(),
		new ServiceParser()
	];

	public globPatterns: string[] = [
		'/**/*.html',
		'/**/*.ts'
	];

	public messages: string[] = [];

	public constructor(public serializer: SerializerInterface) { }

	/**
	 * Extracts messages from paths
	 */
	public extract(dir: string): string[] {
		let messages = [];

		this._getFiles(dir).forEach(filePath => {
			const result = this._extractMessages(filePath);
			messages = [...messages, ...result];
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
	 * Get all files in dir that matches glob patterns
	 */
	protected _getFiles(dir: string): string[] {
		let results: string[] = [];

		this.globPatterns.forEach(globPattern => {
			const files = glob
				.sync(dir + globPattern)
				.filter(filePath => fs.statSync(filePath).isFile());

			results = [...results, ...files];
		});

		return results;
	}

	/**
	 * Extract messages from file using parser
	 */
	protected _extractMessages(filePath: string): string[] {
		let results: string[] = [];

		const contents: string = fs.readFileSync(filePath, 'utf-8');
		this.parsers.forEach((parser: ParserInterface) => {
			results = [...results, ...parser.process(filePath, contents)];
		});

		return results;
	}

}
