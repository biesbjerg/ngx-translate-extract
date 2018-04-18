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
var abstract_template_parser_1 = require("./abstract-template.parser");
var translation_collection_1 = require("../utils/translation.collection");
var cheerio = require("cheerio");
var $ = cheerio.load('', { xmlMode: true });
var DirectiveParser = (function (_super) {
    __extends(DirectiveParser, _super);
    function DirectiveParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DirectiveParser.prototype.extract = function (contents, path) {
        if (path && this._isAngularComponent(path)) {
            contents = this._extractInlineTemplate(contents);
        }
        return this._parseTemplate(contents);
    };
    DirectiveParser.prototype._parseTemplate = function (template) {
        var collection = new translation_collection_1.TranslationCollection();
        template = this._normalizeTemplateAttributes(template);
        var selector = '[translate], [ng2-translate]';
        $(template)
            .find(selector)
            .addBack(selector)
            .each(function (i, element) {
            var $element = $(element);
            var attr = $element.attr('translate') || $element.attr('ng2-translate');
            if (attr) {
                collection = collection.add(attr);
            }
            else {
                $element
                    .contents()
                    .toArray()
                    .filter(function (node) { return node.type === 'text'; })
                    .map(function (node) { return node.nodeValue.trim(); })
                    .filter(function (text) { return text.length > 0; })
                    .forEach(function (text) { return collection = collection.add(text); });
            }
        });
        return collection;
    };
    DirectiveParser.prototype._normalizeTemplateAttributes = function (template) {
        return template.replace(/\[([^\]]+)\]="'([^']*)'"/g, '$1="$2"');
    };
    return DirectiveParser;
}(abstract_template_parser_1.AbstractTemplateParser));
exports.DirectiveParser = DirectiveParser;
//# sourceMappingURL=directive.parser.js.map