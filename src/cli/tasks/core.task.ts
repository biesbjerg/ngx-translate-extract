import { TranslationCollection } from '../../utils/translation.collection';
import { TaskInterface } from './task.interface';
import { ParserInterface } from '../../parsers/parser.interface';
import { PostProcessorInterface } from '../../post-processors/post-processor.interface';
import { CompilerInterface } from '../../compilers/compiler.interface';

import { bold, cyan, dim, green, red } from 'colorette';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';

export abstract class CoreTask implements TaskInterface {

	protected parsers: ParserInterface[] = [];
	protected postProcessors: PostProcessorInterface[] = [];
	protected compiler: CompilerInterface;

	protected constructor(protected inputs: string[], protected outputs: string[]) {
		this.inputs = inputs.map((input) => path.resolve(input));
		this.outputs = outputs.map((output) => path.resolve(output));
	}

	public execute(): void {
		if (!this.compiler) {
			throw new Error('No compiler configured');
		}

		this.printEnabledParsers();
		this.printEnabledPostProcessors();
		this.printEnabledCompiler();

		this.out(bold('Extracting:'));
		const extracted = this.extract();
		this.out(green(`\nFound %d strings.\n`), extracted.count());

		this.executeTask(extracted);
	}

	protected abstract executeTask(extracted: TranslationCollection): void;

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
		this.inputs.forEach((pattern) => {
			this.getFiles(pattern).forEach((filePath) => {
				this.out(dim('- %s'), filePath);
				const contents: string = fs.readFileSync(filePath, 'utf-8');
				this.parsers.forEach((parser) => {
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
	 * Get all files matching pattern
	 */
	protected getFiles(pattern: string): string[] {
		return glob.sync(pattern).filter((filePath) => fs.statSync(filePath).isFile());
	}

	protected out(...args: any[]): void {
		console.log.apply(this, arguments);
	}

	protected printEnabledParsers(): void {
		this.out(cyan('Enabled parsers:'));
		if (this.parsers.length) {
			this.out(cyan(dim(this.parsers.map((parser) => `- ${parser.constructor.name}`).join('\n'))));
		} else {
			this.out(cyan(dim('(none)')));
		}
		this.out();
	}

	protected printEnabledPostProcessors(): void {
		this.out(cyan('Enabled post processors:'));
		if (this.postProcessors.length) {
			this.out(cyan(dim(this.postProcessors.map((postProcessor) => `- ${postProcessor.constructor.name}`).join('\n'))));
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

	protected createOutputPath(output: string): string {
		let dir: string = output;
		let filename: string = `strings.${this.compiler.extension}`;
		if (!fs.existsSync(output) || !fs.statSync(output).isDirectory()) {
			dir = path.dirname(output);
			filename = path.basename(output);
		}

		return path.join(dir, filename);
	}

	protected getExistingTranslationCollection(outputPath: string): TranslationCollection {
		let existing: TranslationCollection = new TranslationCollection();
		if (fs.existsSync(outputPath)) {
			try {
				existing = this.compiler.parse(fs.readFileSync(outputPath, 'utf-8'));
			} catch (e) {
				this.out(`%s %s`, dim(`- ${outputPath}`), red(`[ERROR]`));
				throw e;
			}
		}
		return existing;
	}
}
