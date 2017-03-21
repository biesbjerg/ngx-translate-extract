import { ExtractTask } from './tasks/extract.task';
import { PipeParser } from '../parsers/pipe.parser';
import { DirectiveParser } from '../parsers/directive.parser';
import { ServiceParser } from '../parsers/service.parser';

import * as fs from 'fs';
import * as yargs from 'yargs';

export const cli = yargs
	.usage('Extract strings from files for translation.\nUsage: $0 [options]')
	.version('2.0.0') // TODO: Read from package.json
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
				throw new Error(`The path you supplied was not found: '${dir}'`)
			}

		});
		return true;
	})
	.option('patterns', {
		alias: 'p',
		describe: 'Input file patterns to parse',
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
	.exitProcess(true)
	.parse(process.argv);

const extractTask = new ExtractTask(cli.input, cli.output, {
	replace: cli.replace,
	sort: cli.sort,
	clean: cli.clean,
	patterns: cli.patterns
});

extractTask
	.setParsers([
		new ServiceParser(),
		new PipeParser(),
		new DirectiveParser()
	])
	.setCompiler(cli.format)
	.execute();

