"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extractor_1 = require("../utils/extractor");
var pipe_parser_1 = require("../parsers/pipe.parser");
var directive_parser_1 = require("../parsers/directive.parser");
var service_parser_1 = require("../parsers/service.parser");
var ast_service_parser_1 = require("../parsers/ast-service.parser");
var json_compiler_1 = require("../compilers/json.compiler");
var namespaced_json_compiler_1 = require("../compilers/namespaced-json.compiler");
var po_compiler_1 = require("../compilers/po.compiler");
var fs = require("fs");
var path = require("path");
var cli = require("cli");
var options = cli.parse({
    dir: ['d', 'Path you would like to extract strings from', 'dir', process.env.PWD],
    output: ['o', 'Path you would like to save extracted strings to', 'dir', process.env.PWD],
    format: ['f', 'Output format', ['json', 'namespaced-json', 'pot'], 'json'],
    replace: ['r', 'Replace the contents of output file if it exists (Merges by default)', 'boolean', false],
    sort: ['s', 'Sort translations in the output file in alphabetical order', 'boolean', false],
    clean: ['c', 'Remove obsolete strings when merging', 'boolean', false],
    experimental: ['e', 'Use experimental AST Service Parser', 'boolean', false]
});
var patterns = [
    '/**/*.html',
    '/**/*.ts'
];
var parsers = [
    new pipe_parser_1.PipeParser(),
    new directive_parser_1.DirectiveParser(),
    options.experimental ? new ast_service_parser_1.AstServiceParser() : new service_parser_1.ServiceParser()
];
var compiler;
var ext;
switch (options.format) {
    case 'pot':
        compiler = new po_compiler_1.PoCompiler();
        ext = 'pot';
        break;
    case 'json':
        compiler = new json_compiler_1.JsonCompiler();
        ext = 'json';
        break;
    case 'namespaced-json':
        compiler = new namespaced_json_compiler_1.NamespacedJsonCompiler();
        ext = 'json';
        break;
}
var normalizedDir = path.resolve(options.dir);
var normalizedOutput = path.resolve(options.output);
var outputDir = normalizedOutput;
var outputFilename = "template." + ext;
if (!fs.existsSync(normalizedOutput) || !fs.statSync(normalizedOutput).isDirectory()) {
    outputDir = path.dirname(normalizedOutput);
    outputFilename = path.basename(normalizedOutput);
}
var outputPath = path.join(outputDir, outputFilename);
[normalizedDir, outputDir].forEach(function (dir) {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
        cli.fatal("The path you supplied was not found: '" + dir + "'");
    }
});
try {
    var extractor = new extractor_1.Extractor(parsers, patterns);
    cli.info("Extracting strings from '" + normalizedDir + "'");
    var extracted = extractor.process(normalizedDir);
    cli.ok("* Extracted " + extracted.count() + " strings");
    var collection = extracted;
    if (!options.replace && fs.existsSync(outputPath)) {
        var existing = compiler.parse(fs.readFileSync(outputPath, 'utf-8'));
        if (existing.count() > 0) {
            collection = extracted.union(existing);
            cli.ok("* Merged with " + existing.count() + " existing strings");
        }
        if (options.clean) {
            var collectionCount = collection.count();
            collection = collection.intersect(extracted);
            var removeCount = collectionCount - collection.count();
            if (removeCount > 0) {
                cli.ok("* Removed " + removeCount + " obsolete strings");
            }
        }
    }
    if (options.sort) {
        collection = collection.sort();
    }
    fs.writeFileSync(outputPath, compiler.compile(collection));
    cli.ok("* Saved to '" + outputPath + "'");
}
catch (e) {
    cli.fatal(e.toString());
}
//# sourceMappingURL=extract.js.map