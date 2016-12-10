#! /usr/bin/env node

const Extractor = require('../dist/extractor').Extractor;
const PipeParser = require('../dist/parsers/pipe.parser').PipeParser;
const DirectiveParser = require('../dist/parsers/directive.parser').DirectiveParser;
const ServiceParser = require('../dist/parsers/service.parser').ServiceParser;
const JsonCompiler = require('../dist/compilers/json.compiler').JsonCompiler;
const PoCompiler = require('../dist/compilers/po.compiler').PoCompiler

const fs = require('fs');
const path = require('path');
const cli = require('cli');

const options = cli.parse({
	dir: ['d', 'Directory path you would like to extract strings from', 'dir', process.env.PWD],
	output: ['o', 'Directory path you would like to save extracted strings', 'dir', process.env.PWD],
	format: ['f', 'Output format', ['json', 'pot'], 'json'],
	replace: ['r', 'Replace the contents of output file if it exists (merging by default)', 'boolean', false],
	clean: ['c', 'Remove unused keys when merging', 'boolean', false]
});

[options.dir, options.output].forEach(dir => {
	if (!fs.existsSync(dir)) {
		cli.fatal('The directory path you supplied was not found: ' + dir);
	}
});

const filename = 'template.' + options.format;
const dest = path.join(options.output, filename);

const parsers = [
	new PipeParser(),
	new DirectiveParser(),
	new ServiceParser()
];
const patterns = [
	'/**/*.html',
	'/**/*.ts',
	'/**/*.js'
];

const extractor = new Extractor(parsers, patterns);

try {
	cli.info(`Extracting strings from '${options.dir}'`);
	const extracted = extractor.process(options.dir);
	cli.ok(`* Extracted ${extracted.count()} strings`);

	if (extracted.isEmpty()) {
		process.exit();
	}

	let collection = extracted;

	let compiler = new JsonCompiler();
	if (options.format === 'pot') {
		compiler = new PoCompiler();
	}

	if (!options.replace && fs.existsSync(dest)) {
		const existing = compiler.parse(fs.readFileSync(dest, 'utf-8'));

		collection = extracted.union(existing);
		cli.ok(`* Merged ${existing.count()} existing strings`);

		if (options.clean) {
			const collectionCount = collection.count();
			collection = collection.intersect(extracted);
			const removeCount = collectionCount - collection.count();
			if (removeCount > 0) {
				cli.ok(`* Removed ${removeCount} unused strings`);
			}
		}
	}

	fs.writeFileSync(dest, compiler.compile(collection));
	cli.ok(`* Saved to '${dest}'`);
} catch (e) {
	cli.fatal(e.toString());
}
