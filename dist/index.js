"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./utils/translation.collection"));
__export(require("./utils/utils"));
__export(require("./cli/cli"));
__export(require("./cli/tasks/extract.task"));
__export(require("./parsers/abstract-template.parser"));
__export(require("./parsers/abstract-ast.parser"));
__export(require("./parsers/directive.parser"));
__export(require("./parsers/pipe.parser"));
__export(require("./parsers/service.parser"));
__export(require("./parsers/function.parser"));
__export(require("./compilers/compiler.factory"));
__export(require("./compilers/json.compiler"));
__export(require("./compilers/namespaced-json.compiler"));
__export(require("./compilers/po.compiler"));
//# sourceMappingURL=index.js.map