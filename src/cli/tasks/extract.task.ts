import { TranslationCollection } from '../../utils/translation.collection';
import { TaskInterface } from './task.interface';
import { ParserInterface } from '../../parsers/parser.interface';
import { PostProcessorInterface } from '../../post-processors/post-processor.interface';
import { CompilerInterface } from '../../compilers/compiler.interface';

import { cyan, green, bold, dim } from 'colorette';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

export interface ExtractTaskOptionsInterface {
	replace?: boolean;
	patterns?: string[];
	verbose?: boolean;
}

export class ExtractTask implements TaskInterface {
	protected options: ExtractTaskOptionsInterface = {
		replace: false,
		patterns: [],
		verbose: false
	};

	protected parsers: ParserInterface[] = [];
	protected postProcessors: PostProcessorInterface[] = [];
	protected compiler: CompilerInterface;

	public constructor(protected inputs: string[], protected outputs: string[], options?: ExtractTaskOptionsInterface) {
		this.inputs = inputs.map(input => path.resolve(input));
		this.outputs = outputs.map(output => path.resolve(output));
		this.options = { ...this.options, ...options };
	}

	public execute(): void {
		if (!this.compiler) {
			throw new Error('No compiler configured');
		}

		if (this.options.verbose) {
			this.printEnabledParsers();
			this.printEnabledPostProcessors();
			this.printEnabledCompiler();
		}

		this.out(bold('Extracting:'));
		const extracted = this.extract();
		this.out(green(`\nFound %d strings.\n`), extracted.count());

		this.out(bold('Saving:'));

		this.outputs.forEach(output => {
			let dir: string = output;
			let filename: string = `strings.${this.compiler.extension}`;
			if (!fs.existsSync(output) || !fs.statSync(output).isDirectory()) {
				dir = path.dirname(output);
				filename = path.basename(output);
			}

			const outputPath: string = path.join(dir, filename);

			let existing: TranslationCollection = new TranslationCollection();
			if (!this.options.replace && fs.existsSync(outputPath)) {
				existing = this.compiler.parse(fs.readFileSync(outputPath, 'utf-8'));
			}

			// merge extracted strings with existing
			const draft = extracted.union(existing);

			if (!this.options.replace) {
				this.out(green(`\nFound %d new strings.\n`), draft.count() - existing.count());
			}

			if (existing.isEmpty()) {
				this.out(dim(`- ${outputPath}`));
			} else {
				this.out(dim(`- ${outputPath} (merged)`));
			}

			// Run collection through post processors
			const final = this.process(draft, extracted, existing);

			// Save to file
			this.save(outputPath, final);
		});

		this.out(green('\nDone.\n'));
	}

	public setParsers(parsers: ParserInterface[]): this {
		this.parsers = parsers;
		return this;
	}

	public setPostProcessors(postProcessors: PostProcessorInterface[]): this {
		this.postProcessors = postProcessors;
		return this;
	}

	public setCompiler(compiler: CompilerInterface): this {
		this.compiler = compiler;
		return this;
	}

	/**
	 * Extract strings from specified input dirs using configured parsers
	 */
	protected extract(): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();
		this.inputs.forEach(dir => {
			this.readDir(dir, this.options.patterns).forEach(filePath => {
				if (this.options.verbose) {
					this.out(dim('- %s'), filePath);
				}
				const contents: string = fs.readFileSync(filePath, 'utf-8');
				this.parsers.forEach(parser => {
					const extracted = parser.extract(contents, filePath);
					if (extracted instanceof TranslationCollection) {
						collection = collection.union(extracted);
					}
				});
			});
		});
		return collection;
	}

	/**
	 * Run strings through configured post processors
	 */
	protected process(draft: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection {
		this.postProcessors.forEach(postProcessor => {
			draft = postProcessor.process(draft, extracted, existing);
		});
		return draft;
	}

	/**
	 * Compile and save translations
	 * @param collection
	 */
	protected save(output: string, collection: TranslationCollection): void {
		const dir = path.dirname(output);
		if (!fs.existsSync(dir)) {
			mkdirp.sync(dir);
		}
		fs.writeFileSync(output, this.compiler.compile(collection));
	}

	/**
	 * Get all files in dir matching patterns
	 */
	protected readDir(dir: string, patterns: string[]): string[] {
		return patterns.reduce((results, pattern) => {
			return glob
				.sync(dir + pattern)
				.filter(filePath => fs.statSync(filePath).isFile())
				.concat(results);
		}, []);
	}

	protected out(...args: any[]): void {
		console.log.apply(this, arguments);
	}

	protected printEnabledParsers(): void {
		this.out(cyan('Enabled parsers:'));
		if (this.parsers.length) {
			this.out(cyan(dim(this.parsers.map(parser => `- ${parser.constructor.name}`).join('\n'))));
		} else {
			this.out(cyan(dim('(none)')));
		}
		this.out();
	}

	protected printEnabledPostProcessors(): void {
		this.out(cyan('Enabled post processors:'));
		if (this.postProcessors.length) {
			this.out(cyan(dim(this.postProcessors.map(postProcessor => `- ${postProcessor.constructor.name}`).join('\n'))));
		} else {
			this.out(cyan(dim('(none)')));
		}
		this.out();
	}

	protected printEnabledCompiler(): void {
		this.out(cyan('Compiler:'));
		this.out(cyan(dim(`- ${this.compiler.constructor.name}`)));
		this.out();
	}
}
