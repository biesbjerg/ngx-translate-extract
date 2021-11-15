export class KeyAsDefaultValuePostProcessor {
    name = 'KeyAsDefaultValue';
    process(draft, extracted, existing) {
        return draft.map((key, val) => (val === '' ? key : val));
    }
}
//# sourceMappingURL=key-as-default-value.post-processor.js.map