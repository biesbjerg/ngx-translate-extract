import * as fs from 'fs';
import * as yargs from 'yargs';

import { ParserInterface, ParserInterfaceWithConfig } from '../parsers/parser.interface';

import { PostProcessorInterface } from '../post-processors/post-processor.interface';
import { SortByKeyPostProcessor } from '../post-processors/sort-by-key.post-processor';
import { KeyAsDefaultValuePostProcessor } from '../post-processors/key-as-default-value.post-processor';
import { PurgeObsoleteKeysPostProcessor } from '../post-processors/purge-obsolete-keys.post-processor';
import { CompilerInterface } from '../compilers/compiler.interface';
import { CompilerFactory } from '../compilers/compiler.factory';
import { donateMessage } from '../utils/donate';

import { interfaces } from 'inversify';
import { TYPES } from '../ioc/types';
import { container } from '../ioc/inversify.config';
import { TaskInterface } from './tasks/task.interface';

export const getExtractTask = () => {

	let selectors = container.getAll<CompilerInterface>(TYPES.COMPILER).map( compiler => compiler.selector);

	const cli = yargs
		.usage('Extract strings from files for translation.\nUsage: $0 [options]')
		.version(require(__dirname + '/../../package.json').version)
		.alias('version', 'v')
		.help('help')
		.alias('help', 'h')
		.option('input', {
			alias: 'i',
			describe: 'Paths you would like to extract strings from. You can use path expansion, glob patterns and multiple paths',
			default: process.env.PWD,
			type: 'array',
			normalize: true
		})
		.check(options => {
			options.input.forEach((dir: string) => {
				if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
					throw new Error(`The path you supplied was not found: '${dir}'`);
				}

			});
			return true;
		})
		.option('patterns', {
			alias: 'p',
			describe: 'Extract strings from the following file patterns',
			type: 'array',
			default: ['/**/*.html', '/**/*.ts']
		})
		.option('output', {
			alias: 'o',
			describe: 'Paths where you would like to save extracted strings. You can use path expansion, glob patterns and multiple paths',
			type: 'array',
			normalize: true,
			required: true
		})
		.option('marker', {
			alias: 'm',
			describe: 'Extract strings passed to a marker function',
			default: false,
			type: 'string'
		})
		.option('format', {
			alias: 'f',
			describe: 'Output format',
			default: 'json',
			type: 'string',
			choices: selectors
		})
		.option('format-indentation', {
			alias: 'fi',
			describe: 'Output format indentation',
			default: '\t',
			type: 'string'
		})
		.option('replace', {
			alias: 'r',
			describe: 'Replace the contents of output file if it exists (Merges by default)',
			default: false,
			type: 'boolean'
		})
		.option('sort', {
			alias: 's',
			describe: 'Sort strings in alphabetical order when saving',
			default: false,
			type: 'boolean'
		})
		.option('clean', {
			alias: 'c',
			describe: 'Remove obsolete strings when merging',
			default: false,
			type: 'boolean'
		})
		.option('key-as-default-value', {
			alias: 'k',
			describe: 'Use key as default value for translations',
			default: false,
			type: 'boolean'
		})
		.exitProcess(true)
		.parse(process.argv);

	const extractTaskFactory = container.get<interfaces.Factory<TaskInterface>>(TYPES.TASK_FACTORY);
	const extractTask = <TaskInterface> extractTaskFactory(cli.input, cli.output, {
		replace: cli.replace,
		patterns: cli.patterns
	});

	// Parsers
	const parsers: ParserInterface[] = [container.get<ParserInterface>(TYPES.SERVICE_PARSER),
		container.get<ParserInterface>(TYPES.DIRECTIVE_PARSER),
		container.get<ParserInterface>(TYPES.PIPE_PARSER)];


	if (cli.marker) {
		let functionParserFactory = container.get<interfaces.Factory<ParserInterfaceWithConfig>>(TYPES.PARSER_WITH_CONFIG_FACTORY);
		let functionParser = functionParserFactory({
			identifier: cli.marker
		});
		parsers.push(<ParserInterface> functionParser);
	}
	extractTask.setParsers(parsers);

	// Post processors
	const postProcessors: PostProcessorInterface[] = [];
	if (cli.clean) {
		postProcessors.push(new PurgeObsoleteKeysPostProcessor());
	}
	if (cli.keyAsDefaultValue) {
		postProcessors.push(new KeyAsDefaultValuePostProcessor());
	}
	if (cli.sort) {
		postProcessors.push(new SortByKeyPostProcessor());
	}
	extractTask.setPostProcessors(postProcessors);

	// Compiler
	const compiler: CompilerInterface = CompilerFactory.create(cli.format, {
		indentation: cli.formatIndentation
	});
	extractTask.setCompiler(compiler);

	//extractTask.execute();

	console.log(donateMessage);

	return extractTask;
};

