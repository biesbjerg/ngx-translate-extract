import { TranslationCollection } from '../utils/translation.collection.js';
import { stripBOM } from '../utils/utils.js';
import pkg from 'flat';
const { flatten } = pkg;
export class JsonCompiler {
    indentation = '\t';
    extension = 'json';
    constructor(options) {
        if (options && typeof options.indentation !== 'undefined') {
            this.indentation = options.indentation;
        }
    }
    compile(collection) {
        return JSON.stringify(collection.values, null, this.indentation);
    }
    parse(contents) {
        let values = JSON.parse(stripBOM(contents));
        if (this.isNamespacedJsonFormat(values)) {
            values = flatten(values);
        }
        return new TranslationCollection(values);
    }
    isNamespacedJsonFormat(values) {
        return Object.keys(values).some((key) => typeof values[key] === 'object');
    }
}
//# sourceMappingURL=json.compiler.js.map