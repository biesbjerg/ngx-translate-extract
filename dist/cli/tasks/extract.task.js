"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var translation_collection_1 = require("../../utils/translation.collection");
var chalk = require("chalk");
var glob = require("glob");
var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");
var ExtractTask = (function () {
    function ExtractTask(_input, _output, options) {
        this._input = _input;
        this._output = _output;
        this._options = {
            replace: false,
            sort: false,
            clean: false,
            patterns: []
        };
        this._parsers = [];
        this._options = Object.assign({}, this._options, options);
    }
    ExtractTask.prototype.execute = function () {
        if (!this._parsers) {
            throw new Error('No parsers configured');
        }
        if (!this._compiler) {
            throw new Error('No compiler configured');
        }
        var collection = this._extract();
        this._out(chalk.green('Extracted %d strings\n'), collection.count());
        this._save(collection);
    };
    ExtractTask.prototype.setParsers = function (parsers) {
        this._parsers = parsers;
        return this;
    };
    ExtractTask.prototype.setCompiler = function (compiler) {
        this._compiler = compiler;
        return this;
    };
    ExtractTask.prototype._extract = function () {
        var _this = this;
        this._out(chalk.bold('Extracting strings...'));
        var collection = new translation_collection_1.TranslationCollection();
        this._input.forEach(function (dir) {
            _this._readDir(dir, _this._options.patterns).forEach(function (path) {
                _this._out(chalk.gray('- %s'), path);
                var contents = fs.readFileSync(path, 'utf-8');
                _this._parsers.forEach(function (parser) {
                    collection = collection.union(parser.extract(contents, path));
                });
            });
        });
        return collection;
    };
    ExtractTask.prototype._save = function (collection) {
        var _this = this;
        this._output.forEach(function (output) {
            var normalizedOutput = path.resolve(output);
            var dir = normalizedOutput;
            var filename = "strings." + _this._compiler.extension;
            if (!fs.existsSync(normalizedOutput) || !fs.statSync(normalizedOutput).isDirectory()) {
                dir = path.dirname(normalizedOutput);
                filename = path.basename(normalizedOutput);
            }
            var outputPath = path.join(dir, filename);
            var processedCollection = collection;
            _this._out(chalk.bold('\nSaving: %s'), outputPath);
            if (fs.existsSync(outputPath) && !_this._options.replace) {
                var existingCollection = _this._compiler.parse(fs.readFileSync(outputPath, 'utf-8'));
                if (!existingCollection.isEmpty()) {
                    processedCollection = processedCollection.union(existingCollection);
                    _this._out(chalk.dim('- merged with %d existing strings'), existingCollection.count());
                }
                if (_this._options.clean) {
                    var collectionCount = processedCollection.count();
                    processedCollection = processedCollection.intersect(collection);
                    var removeCount = collectionCount - processedCollection.count();
                    if (removeCount > 0) {
                        _this._out(chalk.dim('- removed %d obsolete strings'), removeCount);
                    }
                }
            }
            if (_this._options.sort) {
                processedCollection = processedCollection.sort();
                _this._out(chalk.dim('- sorted strings'));
            }
            if (!fs.existsSync(dir)) {
                mkdirp.sync(dir);
                _this._out(chalk.dim('- created dir: %s'), dir);
            }
            fs.writeFileSync(outputPath, _this._compiler.compile(processedCollection));
            _this._out(chalk.green('Done!'));
        });
    };
    ExtractTask.prototype._readDir = function (dir, patterns) {
        return patterns.reduce(function (results, pattern) {
            return glob.sync(dir + pattern)
                .filter(function (path) { return fs.statSync(path).isFile(); })
                .concat(results);
        }, []);
    };
    ExtractTask.prototype._out = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(this, arguments);
    };
    return ExtractTask;
}());
exports.ExtractTask = ExtractTask;
//# sourceMappingURL=extract.task.js.map