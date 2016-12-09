#! /usr/bin/env node

var cli = require('cli');
var fs = require('fs');
var path = require('path');

var Extractor = require('../dist/extractor').Extractor;
var JsonCompiler = require('../dist/compilers/json.compiler').JsonCompiler;
var PoCompiler = require('../dist/compilers/po.compiler').PoCompiler

var options = cli.parse({
	dir: ['d', 'Directory path you would like to extract strings from', 'dir', process.env.PWD],
	output: ['o', 'Directory path you would like to save extracted strings', 'dir', process.env.PWD],
	format: ['f', 'Output format', ['json', 'pot'], 'json'],
	merge: ['m', 'Merge extracted strings with existing file if it exists', 'boolean', true],
	clean: ['c', 'Remove unused keys when merging', 'boolean', false]
});

[options.dir, options.output].forEach(dir => {
	if (!fs.existsSync(dir)) {
		cli.fatal('The directory path you supplied was not found: ' + dir);
	}
});

switch (options.format) {
	case 'pot':
		var compiler = new PoCompiler();
		break;
	case 'json':
		var compiler = new JsonCompiler();
		break;
}

var filename = 'template.' + options.format;
var dest = path.join(options.output, filename);

try {
	var extracted = new Extractor().process(options.dir);
	cli.info(`* Extracted ${extracted.count()} strings`);

	if (extracted.isEmpty()) {
		process.exit();
	}

	let collection = extracted;

	if (options.merge && fs.existsSync(dest)) {
		const existing = compiler.parse(fs.readFileSync(dest, 'utf-8'));

		collection = extracted.union(existing);
		cli.info(`* Merged with existing strings`);

		if (options.clean) {
			const stringCount = collection.count();
			collection = collection.intersect(extracted);
			cli.info(`* Removed ${stringCount - collection.count()} unused strings`);
		}
	}

	fs.writeFileSync(dest, compiler.compile(collection));
	cli.ok(`Saved to: '${dest}'`);
} catch (e) {
	cli.fatal(e.toString());
}
