"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_ast_parser_1 = require("./abstract-ast.parser");
var translation_collection_1 = require("../utils/translation.collection");
var ts = require("typescript");
var FunctionParser = (function (_super) {
    __extends(FunctionParser, _super);
    function FunctionParser(options) {
        var _this = _super.call(this) || this;
        _this._functionIdentifier = '_';
        if (options && typeof options.identifier !== 'undefined') {
            _this._functionIdentifier = options.identifier;
        }
        return _this;
    }
    FunctionParser.prototype.extract = function (contents, path) {
        var _this = this;
        var collection = new translation_collection_1.TranslationCollection();
        this._sourceFile = this._createSourceFile(path, contents);
        var callNodes = this._findCallNodes();
        callNodes.forEach(function (callNode) {
            var keys = _this._getCallArgStrings(callNode);
            if (keys && keys.length) {
                collection = collection.addKeys(keys);
            }
        });
        return collection;
    };
    FunctionParser.prototype._findCallNodes = function (node) {
        var _this = this;
        if (!node) {
            node = this._sourceFile;
        }
        var callNodes = this._findNodes(node, ts.SyntaxKind.CallExpression);
        callNodes = callNodes
            .filter(function (callNode) {
            if (callNode.arguments.length < 1) {
                return false;
            }
            var identifier = callNode.getChildAt(0).text;
            if (identifier !== _this._functionIdentifier) {
                return false;
            }
            return true;
        });
        return callNodes;
    };
    return FunctionParser;
}(abstract_ast_parser_1.AbstractAstParser));
exports.FunctionParser = FunctionParser;
//# sourceMappingURL=function.parser.js.map