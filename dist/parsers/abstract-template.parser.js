"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractTemplateParser = (function () {
    function AbstractTemplateParser() {
    }
    AbstractTemplateParser.prototype._isAngularComponent = function (path) {
        return (/\.ts|js$/i).test(path);
    };
    AbstractTemplateParser.prototype._extractInlineTemplate = function (contents) {
        var regExp = /template\s*:\s*(["'`])([^\1]*?)\1/;
        var match = regExp.exec(contents);
        if (match !== null) {
            return match[2];
        }
        return '';
    };
    return AbstractTemplateParser;
}());
exports.AbstractTemplateParser = AbstractTemplateParser;
//# sourceMappingURL=abstract-template.parser.js.map