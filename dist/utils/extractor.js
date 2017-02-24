"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var translation_collection_1 = require("./translation.collection");
var glob = require("glob");
var fs = require("fs");
var Extractor = (function () {
    function Extractor(parsers, patterns) {
        this.parsers = parsers;
        this.patterns = patterns;
    }
    Extractor.prototype.process = function (dir) {
        var _this = this;
        var collection = new translation_collection_1.TranslationCollection();
        this._readDir(dir, this.patterns).forEach(function (path) {
            var contents = fs.readFileSync(path, 'utf-8');
            _this.parsers.forEach(function (parser) {
                collection = collection.union(parser.extract(contents, path));
            });
        });
        return collection;
    };
    Extractor.prototype._readDir = function (dir, patterns) {
        return patterns.reduce(function (results, pattern) {
            return glob.sync(dir + pattern)
                .filter(function (path) { return fs.statSync(path).isFile(); })
                .concat(results);
        }, []);
    };
    return Extractor;
}());
exports.Extractor = Extractor;
//# sourceMappingURL=extractor.js.map