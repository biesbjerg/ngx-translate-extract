import * as os from 'os';
import * as fs from 'fs';
import braces from 'braces';
export function normalizeHomeDir(path) {
    if (path.substring(0, 1) === '~') {
        return `${os.homedir()}/${path.substring(1)}`;
    }
    return path;
}
export function expandPattern(pattern) {
    return braces(pattern, { expand: true, keepEscaping: true });
}
export function normalizePaths(patterns, defaultPatterns = []) {
    return patterns
        .map((pattern) => expandPattern(pattern)
        .map((path) => {
        path = normalizeHomeDir(path);
        if (fs.existsSync(path) && fs.statSync(path).isDirectory()) {
            return defaultPatterns.map((defaultPattern) => path + defaultPattern);
        }
        return path;
    })
        .flat())
        .flat();
}
//# sourceMappingURL=fs-helpers.js.map