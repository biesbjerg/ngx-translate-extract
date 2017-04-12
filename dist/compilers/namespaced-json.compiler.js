"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var translation_collection_1 = require("../utils/translation.collection");
var flat = require("flat");
var NamespacedJsonCompiler = (function () {
    function NamespacedJsonCompiler(options) {
        this.indentation = '\t';
        this.extension = 'json';
        if (options && typeof options.indentation !== 'undefined') {
            this.indentation = options.indentation;
        }
    }
    NamespacedJsonCompiler.prototype.compile = function (collection) {
        var values = flat.unflatten(collection.values, {
            object: true
        });
        return JSON.stringify(values, null, this.indentation);
    };
    NamespacedJsonCompiler.prototype.parse = function (contents) {
        var values = flat.flatten(JSON.parse(contents));
        return new translation_collection_1.TranslationCollection(values);
    };
    return NamespacedJsonCompiler;
}());
exports.NamespacedJsonCompiler = NamespacedJsonCompiler;
//# sourceMappingURL=namespaced-json.compiler.js.map