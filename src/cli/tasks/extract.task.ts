import { TranslationCollection } from '../../utils/translation.collection';
import { CoreTask } from './core.task';
import { ParserInterface } from '../../parsers/parser.interface';
import { PostProcessorInterface } from '../../post-processors/post-processor.interface';
import { CompilerInterface } from '../../compilers/compiler.interface';

import { bold, dim, green, red } from 'colorette';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

export interface ExtractTaskOptionsInterface {
	replace?: boolean;
}

export class ExtractTask extends CoreTask {
	protected options: ExtractTaskOptionsInterface = {
		replace: false
	};

	protected parsers: ParserInterface[] = [];
	protected postProcessors: PostProcessorInterface[] = [];
	protected compiler: CompilerInterface;

	public constructor(protected inputs: string[], protected outputs: string[], options?: ExtractTaskOptionsInterface) {
		super(inputs, outputs);
		this.options = {...this.options, ...options};
	}

	/**
	 * Saves extracted translation keys in file(s)
	 */
	protected executeTask(extracted: TranslationCollection): void {
		this.out(bold('Saving:'));

		this.outputs.forEach((output) => {
			const outputPath = this.createOutputPath(output);

			const existing = this.options.replace ? new TranslationCollection() : this.getExistingTranslationCollection(outputPath);

			// merge extracted strings with existing
			const draft = extracted.union(existing);

			// Run collection through post processors
			const final = this.process(draft, extracted, existing);

			// Save
			try {
				let event = 'CREATED';
				if (fs.existsSync(outputPath)) {
					this.options.replace ? (event = 'REPLACED') : (event = 'MERGED');
				}
				this.save(outputPath, final);
				this.out(`%s %s`, dim(`- ${outputPath}`), green(`[${event}]`));
			} catch (e) {
				this.out(`%s %s`, dim(`- ${outputPath}`), red(`[ERROR]`));
				throw e;
			}
		});
	}

	/**
	 * Run strings through configured post processors
	 */
	protected process(draft: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection {
		this.postProcessors.forEach((postProcessor) => {
			draft = postProcessor.process(draft, extracted, existing);
		});
		return draft;
	}

	/**
	 * Compile and save translations
	 * @param output
	 * @param collection
	 */
	protected save(output: string, collection: TranslationCollection): void {
		const dir = path.dirname(output);
		if (!fs.existsSync(dir)) {
			mkdirp.sync(dir);
		}
		fs.writeFileSync(output, this.compiler.compile(collection));
	}
}
