"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var translation_collection_1 = require("../utils/translation.collection");
var gettext = require("gettext-parser");
var PoCompiler = (function () {
    function PoCompiler(options) {
        this.extension = 'po';
        this.domain = '';
    }
    PoCompiler.prototype.compile = function (collection) {
        var data = {
            charset: 'utf-8',
            headers: {
                'mime-version': '1.0',
                'content-type': 'text/plain; charset=utf-8',
                'content-transfer-encoding': '8bit'
            },
            translations: (_a = {},
                _a[this.domain] = Object.keys(collection.values).reduce(function (translations, key) {
                    translations[key] = {
                        msgid: key,
                        msgstr: collection.get(key)
                    };
                    return translations;
                }, {}),
                _a)
        };
        return gettext.po.compile(data, 'utf-8');
        var _a;
    };
    PoCompiler.prototype.parse = function (contents) {
        var _this = this;
        var collection = new translation_collection_1.TranslationCollection();
        var po = gettext.po.parse(contents, 'utf-8');
        if (!po.translations.hasOwnProperty(this.domain)) {
            return collection;
        }
        var values = Object.keys(po.translations[this.domain])
            .filter(function (key) { return key.length > 0; })
            .reduce(function (values, key) {
            values[key] = po.translations[_this.domain][key].msgstr.pop();
            return values;
        }, {});
        return new translation_collection_1.TranslationCollection(values);
    };
    return PoCompiler;
}());
exports.PoCompiler = PoCompiler;
//# sourceMappingURL=po.compiler.js.map