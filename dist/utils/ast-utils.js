"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
function printAllChildren(sourceFile, node, depth) {
    if (depth === void 0) { depth = 0; }
    console.log(new Array(depth + 1).join('----'), "[" + node.kind + "]", syntaxKindToName(node.kind), "[pos: " + node.pos + "-" + node.end + "]", ':\t\t\t', node.getFullText(sourceFile).trim());
    depth++;
    node.getChildren(sourceFile).forEach(function (childNode) { return printAllChildren(sourceFile, childNode, depth); });
}
exports.printAllChildren = printAllChildren;
function syntaxKindToName(kind) {
    return ts.SyntaxKind[kind];
}
exports.syntaxKindToName = syntaxKindToName;
//# sourceMappingURL=ast-utils.js.map