"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var translation_collection_1 = require("../utils/translation.collection");
var flat = require("flat");
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
        var values = JSON.parse(contents);
        if (this._isNamespacedJsonFormat(values)) {
            values = flat.flatten(values);
        }
        return new translation_collection_1.TranslationCollection(values);
    };
    JsonCompiler.prototype._isNamespacedJsonFormat = function (values) {
        return Object.keys(values).some(function (key) { return typeof values[key] === 'object'; });
    };
    return JsonCompiler;
}());
exports.JsonCompiler = JsonCompiler;
//# sourceMappingURL=json.compiler.js.map