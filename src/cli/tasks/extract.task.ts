import { TranslationCollection } from '../../utils/translation.collection';
import { TaskInterface } from './task.interface';
import { ParserInterface } from '../../parsers/parser.interface';
import { CompilerInterface } from '../../compilers/compiler.interface';

import chalk from 'chalk';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

export interface ExtractTaskOptionsInterface {
	replace?: boolean;
	sort?: boolean;
	clean?: boolean;
	patterns?: string[];
	verbose?: boolean;
	keys?: boolean;
	prefill?: string;
}

export class ExtractTask implements TaskInterface {

	protected _options: ExtractTaskOptionsInterface = {
		replace: false,
		sort: false,
		clean: false,
		patterns: [],
		verbose: true,
		prefill: '',
	};

	protected _parsers: ParserInterface[] = [];
	protected _compiler: CompilerInterface;

	public constructor(protected _input: string[], protected _output: string[], options?: ExtractTaskOptionsInterface) {
		this._options = Object.assign({}, this._options, options);
	}

	public execute(): void {
		if (!this._parsers) {
			throw new Error('No parsers configured');
		}
		if (!this._compiler) {
			throw new Error('No compiler configured');
		}

		const collection = this._extract();
		this._out(chalk.green('Extracted %d strings\n'), collection.count());
		this._save(collection);
	}

	public setParsers(parsers: ParserInterface[]): this {
		this._parsers = parsers;
		return this;
	}

	public setCompiler(compiler: CompilerInterface): this {
		this._compiler = compiler;
		return this;
	}

	/**
	 * Extract strings from input dirs using configured parsers
	 */
	protected _extract(): TranslationCollection {
		this._out(chalk.bold('Extracting strings...'));

		let collection: TranslationCollection = new TranslationCollection();
		this._input.forEach(dir => {
			this._readDir(dir, this._options.patterns).forEach(path => {
				this._options.verbose && this._out(chalk.gray('- %s'), path);
				const contents: string = fs.readFileSync(path, 'utf-8');
				this._parsers.forEach((parser: ParserInterface) => {
					collection = collection.union(parser.extract(contents, path));
				});
			});
		});

		return collection;
	}

	/**
	 * Process collection according to options (merge, clean, sort), compile and save
	 * @param collection
	 */
	protected _save(collection: TranslationCollection): void {
		this._output.forEach(output => {
			const normalizedOutput: string = path.resolve(output);

			let dir: string = normalizedOutput;
			let filename: string = `strings.${this._compiler.extension}`;
			if (!fs.existsSync(normalizedOutput) || !fs.statSync(normalizedOutput).isDirectory()) {
				dir = path.dirname(normalizedOutput);
				filename = path.basename(normalizedOutput);
			}

			const outputPath: string = path.join(dir, filename);
			let processedCollection: TranslationCollection = collection;

			this._out(chalk.bold('\nSaving: %s'), outputPath);

			if (this._options.keys) {
				processedCollection.forEach(element => {
					processedCollection.values[element] = '';
				});
			}

			if (this._options.prefill && this._options.prefill !== '') {
				processedCollection
					.filter(key => !processedCollection.values[key].startsWith(this._options.prefill))
					.forEach(element => {
						processedCollection.values[element] = this._options.prefill + processedCollection.values[element];
					});
			}


			if (fs.existsSync(outputPath) && !this._options.replace) {
				const existingCollection: TranslationCollection = this._compiler.parse(fs.readFileSync(outputPath, 'utf-8'), this._options);
				if (!existingCollection.isEmpty()) {
					processedCollection = processedCollection.union(existingCollection);
					this._out(chalk.dim('- merged with %d existing strings'), existingCollection.count());
				}

				if (this._options.clean) {
					const collectionCount = processedCollection.count();
					processedCollection = processedCollection.intersect(collection);
					const removeCount = collectionCount - processedCollection.count();
					if (removeCount > 0) {
						this._out(chalk.dim('- removed %d obsolete strings'), removeCount);
					}
				}
			}

			if (this._options.sort) {
				processedCollection = processedCollection.sort();
				this._out(chalk.dim('- sorted strings'));
			}

			if (!fs.existsSync(dir)) {
				mkdirp.sync(dir);
				this._out(chalk.dim('- created dir: %s'), dir);
			}


			fs.writeFileSync(outputPath, this._compiler.compile(processedCollection, this._options));

			this._out(chalk.green('Done!'));
		});
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

	protected _out(...args: any[]): void {
		console.log.apply(this, arguments);
	}

}
