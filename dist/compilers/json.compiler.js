"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var translation_collection_1 = require("../utils/translation.collection");
var JsonCompiler = (function () {
    function JsonCompiler() {
    }
    JsonCompiler.prototype.compile = function (collection) {
        return JSON.stringify(collection.values, null, '\t');
    };
    JsonCompiler.prototype.parse = function (contents) {
        return new translation_collection_1.TranslationCollection(JSON.parse(contents));
    };
    return JsonCompiler;
}());
exports.JsonCompiler = JsonCompiler;
//# sourceMappingURL=json.compiler.js.map