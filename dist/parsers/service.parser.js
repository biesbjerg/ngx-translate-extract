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
var ServiceParser = (function (_super) {
    __extends(ServiceParser, _super);
    function ServiceParser() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._serviceClassName = 'TranslateService';
        _this._serviceMethodNames = ['get', 'instant'];
        return _this;
    }
    ServiceParser.prototype.extract = function (contents, path) {
        var _this = this;
        var collection = new translation_collection_1.TranslationCollection();
        this._sourceFile = this._createSourceFile(path, contents);
        this._instancePropertyName = this._getInstancePropertyName();
        if (!this._instancePropertyName) {
            return collection;
        }
        var callNodes = this._findCallNodes();
        callNodes.forEach(function (callNode) {
            var keys = _this._getCallArgStrings(callNode);
            if (keys && keys.length) {
                collection = collection.addKeys(keys);
            }
        });
        return collection;
    };
    ServiceParser.prototype._getInstancePropertyName = function () {
        var _this = this;
        var constructorNode = this._findConstructorNode();
        if (!constructorNode) {
            return null;
        }
        var result = constructorNode.parameters.find(function (parameter) {
            if (!parameter.modifiers) {
                return false;
            }
            var parameterType = parameter.type.typeName;
            if (!parameterType) {
                return false;
            }
            var className = parameterType.text;
            if (className !== _this._serviceClassName) {
                return false;
            }
            return true;
        });
        if (result) {
            return result.name.text;
        }
    };
    ServiceParser.prototype._findConstructorNode = function () {
        var constructors = this._findNodes(this._sourceFile, ts.SyntaxKind.Constructor, true);
        if (constructors.length) {
            return constructors[0];
        }
    };
    ServiceParser.prototype._findCallNodes = function (node) {
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
            var propAccess = callNode.getChildAt(0).getChildAt(0);
            if (!propAccess || propAccess.kind !== ts.SyntaxKind.PropertyAccessExpression) {
                return false;
            }
            if (!propAccess.getFirstToken() || propAccess.getFirstToken().kind !== ts.SyntaxKind.ThisKeyword) {
                return false;
            }
            if (propAccess.name.text !== _this._instancePropertyName) {
                return false;
            }
            var methodAccess = callNode.getChildAt(0);
            if (!methodAccess || methodAccess.kind !== ts.SyntaxKind.PropertyAccessExpression) {
                return false;
            }
            if (!methodAccess.name || _this._serviceMethodNames.indexOf(methodAccess.name.text) === -1) {
                return false;
            }
            return true;
        });
        return callNodes;
    };
    return ServiceParser;
}(abstract_ast_parser_1.AbstractAstParser));
exports.ServiceParser = ServiceParser;
//# sourceMappingURL=service.parser.js.map