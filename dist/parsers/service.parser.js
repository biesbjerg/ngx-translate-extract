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
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServiceParser.prototype.extract = function (contents, path) {
        var _this = this;
        var collection = new translation_collection_1.TranslationCollection();
        this._sourceFile = this._createSourceFile(path, contents);
        var classNodes = this._findClassNodes(this._sourceFile);
        classNodes.forEach(function (classNode) {
            var constructorNode = _this._findConstructorNode(classNode);
            if (!constructorNode) {
                return;
            }
            var propertyName = _this._findTranslateServicePropertyName(constructorNode);
            if (!propertyName) {
                return;
            }
            var callNodes = _this._findCallNodes(classNode, propertyName);
            callNodes.forEach(function (callNode) {
                var keys = _this._getCallArgStrings(callNode);
                if (keys && keys.length) {
                    collection = collection.addKeys(keys);
                }
            });
        });
        return collection;
    };
    ServiceParser.prototype._findTranslateServicePropertyName = function (constructorNode) {
        if (!constructorNode) {
            return null;
        }
        var result = constructorNode.parameters.find(function (parameter) {
            if (!parameter.modifiers) {
                return false;
            }
            if (!parameter.type) {
                return false;
            }
            var parameterType = parameter.type.typeName;
            if (!parameterType) {
                return false;
            }
            var className = parameterType.text;
            if (className !== 'TranslateService') {
                return false;
            }
            return true;
        });
        if (result) {
            return result.name.text;
        }
    };
    ServiceParser.prototype._findClassNodes = function (node) {
        return this._findNodes(node, ts.SyntaxKind.ClassDeclaration);
    };
    ServiceParser.prototype._findConstructorNode = function (node) {
        var constructorNodes = this._findNodes(node, ts.SyntaxKind.Constructor);
        if (constructorNodes) {
            return constructorNodes[0];
        }
    };
    ServiceParser.prototype._findCallNodes = function (node, propertyIdentifier) {
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
            if (propAccess.name.text !== propertyIdentifier) {
                return false;
            }
            var methodAccess = callNode.getChildAt(0);
            if (!methodAccess || methodAccess.kind !== ts.SyntaxKind.PropertyAccessExpression) {
                return false;
            }
            if (!methodAccess.name || (methodAccess.name.text !== 'get' && methodAccess.name.text !== 'instant' && methodAccess.name.text !== 'stream')) {
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