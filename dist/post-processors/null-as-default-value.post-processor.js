export class NullAsDefaultValuePostProcessor {
    name = 'NullAsDefaultValue';
    process(draft, extracted, existing) {
        return draft.map((key, val) => (existing.get(key) === undefined ? null : val));
    }
}
//# sourceMappingURL=null-as-default-value.post-processor.js.map