"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var translation_collection_1 = require("../utils/translation.collection");
var JsonCompiler = (function () {
    function JsonCompiler(options) {
        this.indentation = '\t';
        this.extension = 'json';
        if (options && typeof options.indentation !== 'undefined') {
            this.indentation = options.indentation;
        }
    }
    JsonCompiler.prototype.compile = function (collection) {
        return JSON.stringify(collection.values, null, this.indentation);
    };
    JsonCompiler.prototype.parse = function (contents) {
        return new translation_collection_1.TranslationCollection(JSON.parse(contents));
    };
    return JsonCompiler;
}());
exports.JsonCompiler = JsonCompiler;
//# sourceMappingURL=json.compiler.js.map