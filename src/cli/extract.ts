import { Extractor } from '../utils/extractor';
import { TranslationCollection } from '../utils/translation.collection';
import { ParserInterface } from '../parsers/parser.interface';
import { PipeParser } from '../parsers/pipe.parser';
import { DirectiveParser } from '../parsers/directive.parser';
import { ServiceParser } from '../parsers/service.parser';
import { JsonCompiler } from '../compilers/json.compiler';
import { PoCompiler } from '../compilers/po.compiler';

import * as fs from 'fs';
import * as path from 'path';
import * as cli from 'cli';

const options = cli.parse({
	dir: ['d', 'Directory path you would like to extract strings from', 'dir', process.env.PWD],
	name: ['n', 'Name of the file containing extracted strings', 'string', 'template'],
	output: ['o', 'Directory path you would like to save extracted strings to', 'dir', process.env.PWD],
	format: ['f', 'Output format', ['json', 'pot'], 'json'],
	replace: ['r', 'Replace the contents of output file if it exists (Merges by default)', 'boolean', false],
	clean: ['c', 'Remove obsolete strings when merging', 'boolean', false]
});

[options.dir, options.output].forEach(dir => {
	if (!fs.existsSync(dir)) {
		cli.fatal(`The directory path you supplied was not found: '${dir}'`);
	}
});

const filename: string = options.name + '.' + options.format;
const dest: string = path.join(options.output, filename);

const parsers: ParserInterface[] = [
	new PipeParser(),
	new DirectiveParser(),
	new ServiceParser()
];
const patterns: string[] = [
	'/**/*.html',
	'/**/*.ts',
	'/**/*.js'
];

try {
	const extractor: Extractor = new Extractor(parsers, patterns);
	cli.info(`Extracting strings from '${options.dir}'`);

	const extracted: TranslationCollection = extractor.process(options.dir);
	cli.ok(`* Extracted ${extracted.count()} strings`);

	let collection: TranslationCollection = extracted;

	let compiler = new JsonCompiler();
	if (options.format === 'pot') {
		compiler = new PoCompiler();
	}

	if (!options.replace && fs.existsSync(dest)) {
		const existing: TranslationCollection = compiler.parse(fs.readFileSync(dest, 'utf-8'));
		if (existing.count() > 0) {
			collection = extracted.union(existing);
			cli.ok(`* Merged with ${existing.count()} existing strings`);
		}

		if (options.clean) {
			const collectionCount = collection.count();
			collection = collection.intersect(extracted);
			const removeCount = collectionCount - collection.count();
			if (removeCount > 0) {
				cli.ok(`* Removed ${removeCount} obsolete strings`);
			}
		}
	}

	fs.writeFileSync(dest, compiler.compile(collection));
	cli.ok(`* Saved to '${dest}'`);
} catch (e) {
	cli.fatal(e.toString());
}
