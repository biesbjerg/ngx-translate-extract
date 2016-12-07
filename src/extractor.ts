import { ParserInterface } from './parsers/parser.interface';
import { PipeParser } from './parsers/pipe.parser';
import { DirectiveParser } from './parsers/directive.parser';
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
		'/**/*.ts',
		'/**/*.js'
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
	public serialize(messages: {[key: string]: string}): string {
		return this.serializer.serialize(messages);
	}

	/**
	 * Parse the content of a file and return output as an object
	 */
	public parse(contents: string): {[key: string]: string} {
		return this.serializer.parse(contents);
	}

	/**
	 * Serialize and save to destination
	 */
	public save(destination: string, merge: boolean | 'clean' = true): string {
		let extractedData = this._prepareMessages(this.messages),
			output: string;

		if (merge && fs.existsSync(destination)) {
			const fileData = this.parse(fs.readFileSync(destination, 'utf8'));

			extractedData = this._merge(fileData, extractedData, merge);
		}

		output = this.serialize(extractedData);
		fs.writeFileSync(destination, output);
		return output;
	}

	protected _prepareMessages(messages: string[]): {[key: string]: string} {
		let result = {};

		messages.forEach(message => {
			result[message] = '';
		});

		return result;
	}

	protected _merge(fileData: {[key: string]: string}, extractedData: {[key: string]: string}, merge: boolean | 'clean'): {[key: string]: string} {
		if (merge === 'clean') {
			let existingKeys: string[] = lodash.keys(extractedData);
			let pickedExisting = lodash.pick(fileData, existingKeys);
			return <{[key: string]: string}>lodash.defaultsDeep(pickedExisting, extractedData);
		} else {
			return <{[key: string]: string}>lodash.defaultsDeep(fileData, extractedData);
		}
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
