"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extract_task_1 = require("./tasks/extract.task");
var pipe_parser_1 = require("../parsers/pipe.parser");
var directive_parser_1 = require("../parsers/directive.parser");
var service_parser_1 = require("../parsers/service.parser");
var function_parser_1 = require("../parsers/function.parser");
var compiler_factory_1 = require("../compilers/compiler.factory");
var fs = require("fs");
var yargs = require("yargs");
exports.cli = yargs
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
    .check(function (options) {
    options.input.forEach(function (dir) {
        if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
            throw new Error("The path you supplied was not found: '" + dir + "'");
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
    choices: ['json', 'namespaced-json', 'pot']
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
    .exitProcess(true)
    .parse(process.argv);
var extract = new extract_task_1.ExtractTask(exports.cli.input, exports.cli.output, {
    replace: exports.cli.replace,
    sort: exports.cli.sort,
    clean: exports.cli.clean,
    patterns: exports.cli.patterns
});
var compiler = compiler_factory_1.CompilerFactory.create(exports.cli.format, {
    indentation: exports.cli.formatIndentation
});
extract.setCompiler(compiler);
var parsers = [
    new pipe_parser_1.PipeParser(),
    new directive_parser_1.DirectiveParser(),
    new service_parser_1.ServiceParser()
];
if (exports.cli.marker) {
    parsers.push(new function_parser_1.FunctionParser({
        identifier: exports.cli.marker
    }));
}
extract.setParsers(parsers);
extract.execute();
//# sourceMappingURL=cli.js.map