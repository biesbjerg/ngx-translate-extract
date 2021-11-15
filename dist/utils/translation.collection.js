export class TranslationCollection {
    values = {};
    constructor(values = {}) {
        this.values = values;
    }
    add(key, val = '') {
        return new TranslationCollection({ ...this.values, [key]: val });
    }
    addKeys(keys) {
        const values = keys.reduce((results, key) => {
            return { ...results, [key]: '' };
        }, {});
        return new TranslationCollection({ ...this.values, ...values });
    }
    remove(key) {
        return this.filter((k) => key !== k);
    }
    forEach(callback) {
        Object.keys(this.values).forEach((key) => callback.call(this, key, this.values[key]));
        return this;
    }
    filter(callback) {
        const values = {};
        this.forEach((key, val) => {
            if (callback.call(this, key, val)) {
                values[key] = val;
            }
        });
        return new TranslationCollection(values);
    }
    map(callback) {
        const values = {};
        this.forEach((key, val) => {
            values[key] = callback.call(this, key, val);
        });
        return new TranslationCollection(values);
    }
    union(collection) {
        return new TranslationCollection({ ...this.values, ...collection.values });
    }
    intersect(collection) {
        const values = {};
        this.filter((key) => collection.has(key)).forEach((key, val) => {
            values[key] = val;
        });
        return new TranslationCollection(values);
    }
    has(key) {
        return this.values.hasOwnProperty(key);
    }
    get(key) {
        return this.values[key];
    }
    keys() {
        return Object.keys(this.values);
    }
    count() {
        return Object.keys(this.values).length;
    }
    isEmpty() {
        return Object.keys(this.values).length === 0;
    }
    sort(compareFn) {
        const values = {};
        this.keys()
            .sort(compareFn)
            .forEach((key) => {
            values[key] = this.get(key);
        });
        return new TranslationCollection(values);
    }
}
//# sourceMappingURL=translation.collection.js.map