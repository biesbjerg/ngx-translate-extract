#! /usr/bin/env node

var cli = require('cli');
var fs = require('fs');
var path = require('path');

var Extractor = require('../dist/extractor').Extractor;
var JsonSerializer = require('../dist/serializers/json.serializer').JsonSerializer;
var PotSerializer = require('../dist/serializers/pot.serializer').PotSerializer;

var options = cli.parse({
	dir: ['d', 'Directory path you would like to extract strings from', 'dir', process.env.PWD],
	output: ['o', 'Directory path you would like to save extracted strings', 'dir', process.env.PWD],
	format: ['f', 'Output format', ['json', 'pot'], 'json'],
	replace: ['r', 'Replace the content of the file if it exists (merging by default)', 'boolean', false],
	clean: ['c', 'Remove unused keys when merging', 'boolean', false],
});

[options.dir, options.output].forEach(dir => {
	if (!fs.existsSync(dir)) {
		cli.fatal('The directory path you supplied was not found: ' + dir);
	}
});

switch (options.format) {
	case 'pot':
		var serializer = new PotSerializer();
		break;
	case 'json':
		var serializer = new JsonSerializer();
		break;
}

var filename = 'template.' + options.format;
var destination = path.join(options.output, filename);

try {
	var extractor = new Extractor(serializer);
	var messages = extractor.extract(options.dir);
	if (messages.length > 0) {
		extractor.save(destination, options.replace, options.clean);
		cli.ok(`Extracted ${messages.length} strings: '${destination}'`);
	} else {
		cli.info(`Found no extractable strings in the supplied directory path: '${options.dir}'`);
	}
} catch (e) {
	cli.fatal(e.toString());
}
