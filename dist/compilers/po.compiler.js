import { TranslationCollection } from '../utils/translation.collection.js';
import pkg from 'gettext-parser';
const { po } = pkg;
export class PoCompiler {
    extension = 'po';
    domain = '';
    constructor(options) { }
    compile(collection) {
        const data = {
            charset: 'utf-8',
            headers: {
                'mime-version': '1.0',
                'content-type': 'text/plain; charset=utf-8',
                'content-transfer-encoding': '8bit'
            },
            translations: {
                [this.domain]: Object.keys(collection.values).reduce((translations, key) => {
                    return {
                        ...translations,
                        [key]: {
                            msgid: key,
                            msgstr: collection.get(key)
                        }
                    };
                }, {})
            }
        };
        return po.compile(data).toString('utf8');
    }
    parse(contents) {
        const collection = new TranslationCollection();
        const parsedPo = po.parse(contents, 'utf8');
        if (!parsedPo.translations.hasOwnProperty(this.domain)) {
            return collection;
        }
        const values = Object.keys(parsedPo.translations[this.domain])
            .filter((key) => key.length > 0)
            .reduce((result, key) => {
            return {
                ...result,
                [key]: parsedPo.translations[this.domain][key].msgstr.pop()
            };
        }, {});
        return new TranslationCollection(values);
    }
}
//# sourceMappingURL=po.compiler.js.map