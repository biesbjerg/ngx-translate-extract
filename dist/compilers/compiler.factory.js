"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json_compiler_1 = require("../compilers/json.compiler");
var namespaced_json_compiler_1 = require("../compilers/namespaced-json.compiler");
var po_compiler_1 = require("../compilers/po.compiler");
var CompilerFactory = (function () {
    function CompilerFactory() {
    }
    CompilerFactory.create = function (format, options) {
        switch (format) {
            case 'pot': return new po_compiler_1.PoCompiler(options);
            case 'json': return new json_compiler_1.JsonCompiler(options);
            case 'namespaced-json': return new namespaced_json_compiler_1.NamespacedJsonCompiler(options);
            default: throw new Error("Unknown format: " + format);
        }
    };
    return CompilerFactory;
}());
exports.CompilerFactory = CompilerFactory;
//# sourceMappingURL=compiler.factory.js.map