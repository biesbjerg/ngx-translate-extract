export class StringAsDefaultValuePostProcessor {
    options;
    name = 'StringAsDefaultValue';
    constructor(options) {
        this.options = options;
    }
    process(draft, extracted, existing) {
        return draft.map((key, val) => (existing.get(key) === undefined ? this.options.defaultValue : val));
    }
}
//# sourceMappingURL=string-as-default-value.post-processor.js.map