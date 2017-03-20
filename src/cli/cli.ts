import { Extractor } from '../utils/extractor';
import { CliOptionsInterface } from './cli-options.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { ParserInterface } from '../parsers/parser.interface';
import { PipeParser } from '../parsers/pipe.parser';
import { DirectiveParser } from '../parsers/directive.parser';
import { ServiceParser } from '../parsers/service.parser';
import { CompilerInterface } from '../compilers/compiler.interface';
import { JsonCompiler } from '../compilers/json.compiler';
import { NamespacedJsonCompiler } from '../compilers/namespaced-json.compiler';
import { PoCompiler } from '../compilers/po.compiler';

import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as chalk from 'chalk';
import * as yargs from 'yargs';

const options: CliOptionsInterface = yargs
	.usage('Extract strings from files for translation.\nUsage: $0 [options]')
	.help('h')
	.alias('h', 'help')
	.option('input', {
		alias: ['i', 'dir', 'd'],
		describe: 'Paths you would like to extract strings from. You can use path expansion, glob patterns and multiple paths',
		default: process.env.PWD,
		type: 'array',
	})
	.check((options: CliOptionsInterface) => {
		options.input.forEach(dir => {
			if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
				throw new Error(`The path you supplied was not found: '${dir}'`)
			}

		});
		return true;
	})
	.option('output', {
		alias: 'o',
		describe: 'Paths where you would like to save extracted strings. You can use path expansion, glob patterns and multiple paths',
		type: 'array',
		required: true
	})
	.option('format', {
		alias: 'f',
		describe: 'Output format',
		default: 'json',
		type: 'string',
		choices: ['json', 'namespaced-json', 'pot']
	})
	.option('replace', {
		alias: 'r',
		describe: 'Replace the contents of output file if it exists (Merges by default)',
		default: false,
		type: 'boolean'
	})
	.option('sort', {
		alias: 's',
		describe: 'Sort translations in the output file in alphabetical order',
		default: false,
		type: 'boolean'
	})
	.option('clean', {
		alias: 'c',
		describe: 'Remove obsolete strings when merging',
		default: false,
		type: 'boolean'
	})
	.argv;

const patterns: string[] = [
	'/**/*.html',
	'/**/*.ts'
];
const parsers: ParserInterface[] = [
	new ServiceParser(),
	new PipeParser(),
	new DirectiveParser()
];

let compiler: CompilerInterface;
let ext: string;
switch (options.format) {
	case 'pot':
		compiler = new PoCompiler();
		ext = 'pot';
		break;
	case 'json':
		compiler = new JsonCompiler();
		ext = 'json';
		break;
	case 'namespaced-json':
		compiler = new NamespacedJsonCompiler();
		ext = 'json';
		break;
}

const extractor: Extractor = new Extractor(parsers, patterns);

let extractedStrings: TranslationCollection = new TranslationCollection();

// Extract strings from paths
console.log(chalk.bold('Extracting strings from...'));
options.input.forEach(dir => {
	const normalizedDir: string = path.resolve(dir);
	console.log(chalk.gray('- %s'), normalizedDir);
	extractedStrings = extractedStrings.union(extractor.process(normalizedDir));
});
console.log(chalk.green('Extracted %d strings\n'), extractedStrings.count());

// Save extracted strings to output paths
options.output.forEach(output => {
	const normalizedOutput: string = path.resolve(output);

	let outputDir: string = normalizedOutput;
	let outputFilename: string = `template.${ext}`;
	if (!fs.existsSync(normalizedOutput) || !fs.statSync(normalizedOutput).isDirectory()) {
		outputDir = path.dirname(normalizedOutput);
		outputFilename = path.basename(normalizedOutput);
	}
	const outputPath: string = path.join(outputDir, outputFilename);

	console.log(chalk.bold('Saving to: %s'), outputPath);
	if (!fs.existsSync(outputDir)) {
		console.log(chalk.dim('- Created output dir: %s'), outputDir);
		mkdirp.sync(outputDir);
	}

	let processedStrings: TranslationCollection = extractedStrings;

	if (fs.existsSync(outputPath) && !options.replace) {
		const existingStrings: TranslationCollection = compiler.parse(fs.readFileSync(outputPath, 'utf-8'));
		if (existingStrings.count() > 0) {
			processedStrings = processedStrings.union(existingStrings);
			console.log(chalk.dim('- Merged with %d existing strings'), existingStrings.count());
		}

		if (options.clean) {
			const collectionCount = processedStrings.count();
			processedStrings = processedStrings.intersect(processedStrings);
			const removeCount = collectionCount - processedStrings.count();
			console.log(chalk.dim('- Removed %d obsolete strings'), removeCount);
		}
	}

	if (options.sort) {
		processedStrings = processedStrings.sort();
		console.log(chalk.dim('- Sorted strings'));
	}

	fs.writeFileSync(outputPath, compiler.compile(processedStrings));
	console.log(chalk.green('OK!\n'));
});
