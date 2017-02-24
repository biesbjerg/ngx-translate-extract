"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var translation_collection_1 = require("../utils/translation.collection");
var ast_utils_1 = require("../utils/ast-utils");
var ts = require("typescript");
var AstServiceParser = (function () {
    function AstServiceParser() {
        this._serviceClassName = 'TranslateService';
        this._serviceMethodNames = ['get', 'instant'];
    }
    AstServiceParser.prototype.extract = function (contents, path) {
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
    AstServiceParser.prototype._createSourceFile = function (path, contents) {
        console.log(ts.ScriptTarget);
        return ts.createSourceFile(path, contents, null, false);
    };
    AstServiceParser.prototype._getInstancePropertyName = function () {
        var _this = this;
        var constructorNode = this._findConstructorNode();
        var result = constructorNode.parameters.find(function (parameter) {
            if (!parameter.modifiers) {
                return false;
            }
            var className = parameter.type.typeName.text;
            if (className !== _this._serviceClassName) {
                return false;
            }
            return true;
        });
        if (result) {
            return result.name.text;
        }
    };
    AstServiceParser.prototype._findConstructorNode = function () {
        var constructors = this._findNodes(this._sourceFile, ts.SyntaxKind.Constructor, true);
        if (constructors.length) {
            return constructors[0];
        }
    };
    AstServiceParser.prototype._findCallNodes = function (node) {
        var _this = this;
        if (!node) {
            node = this._sourceFile;
        }
        var callNodes = this._findNodes(node, ts.SyntaxKind.CallExpression);
        callNodes = callNodes
            .filter(function (callNode) { return callNode.arguments.length > 0; })
            .filter(function (callNode) {
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
    AstServiceParser.prototype._getCallArgStrings = function (callNode) {
        if (!callNode.arguments.length) {
            return;
        }
        var firstArg = callNode.arguments[0];
        switch (firstArg.kind) {
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.FirstTemplateToken:
                return [firstArg.text];
            case ts.SyntaxKind.ArrayLiteralExpression:
                return firstArg.elements
                    .map(function (element) { return element.text; });
            case ts.SyntaxKind.Identifier:
                console.log('WARNING: We cannot extract variable values passed to TranslateService (yet)');
                break;
            default:
                console.log("SKIP: Unknown argument type: '" + ast_utils_1.syntaxKindToName(firstArg.kind) + "'", firstArg);
        }
    };
    AstServiceParser.prototype._findNodes = function (node, kind, onlyOne) {
        var _this = this;
        if (onlyOne === void 0) { onlyOne = false; }
        if (node.kind === kind && onlyOne) {
            return [node];
        }
        var childrenNodes = node.getChildren(this._sourceFile);
        var initialValue = node.kind === kind ? [node] : [];
        return childrenNodes.reduce(function (result, childNode) {
            return result.concat(_this._findNodes(childNode, kind));
        }, initialValue);
    };
    return AstServiceParser;
}());
exports.AstServiceParser = AstServiceParser;
//# sourceMappingURL=ast-service.parser.js.map