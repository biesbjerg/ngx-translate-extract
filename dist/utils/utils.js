export function isPathAngularComponent(path) {
    return /\.ts|js$/i.test(path);
}
export function extractComponentInlineTemplate(contents) {
    const regExp = /template\s*:\s*(["'`])([^\1]*?)\1/;
    const match = regExp.exec(contents);
    if (match !== null) {
        return match[2];
    }
    return '';
}
export function stripBOM(contents) {
    return contents.trim();
}
//# sourceMappingURL=utils.js.map