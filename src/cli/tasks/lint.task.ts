import { TranslationCollection } from '../../utils/translation.collection';
import { CoreTask } from './core.task';
import { ParserInterface } from '../../parsers/parser.interface';
import { PostProcessorInterface } from '../../post-processors/post-processor.interface';
import { CompilerInterface } from '../../compilers/compiler.interface';

import { bold, dim, green, red } from 'colorette';

export class LintTask extends CoreTask {

	protected parsers: ParserInterface[] = [];
	protected postProcessors: PostProcessorInterface[] = [];
	protected compiler: CompilerInterface;

	public constructor(protected inputs: string[], protected outputs: string[]) {
		super(inputs, outputs);
	}

	/**
	 * Validates if all extracted translation keys matches the keys in file(s)
	 */
	public executeTask(extracted: TranslationCollection): void {
		this.out(bold('Linting:'));

		let lintingValid: boolean = true;
		this.outputs.forEach((output) => {
			const outputPath = this.createOutputPath(output);

			const existing = this.getExistingTranslationCollection(outputPath);

			const lint = extracted.lintKeys(existing);
			const hasNewKeys = lint.hasNewKeys();
			if (hasNewKeys) {
				this.out(`%s %s`, dim(`- ${outputPath}`), red(`[INVALID KEYS]`), dim(lint.values.toString()));
			} else {
				this.out(`%s %s`, dim(`- ${outputPath}`), green(`[KEYS MATCHED]`));
			}

			if (hasNewKeys) {
				lintingValid = false;
			}
		});

		if (!lintingValid) {
			throw new Error('Linting failed');
		}
	}
}
