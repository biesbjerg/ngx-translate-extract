import { JsonCompiler } from '../compilers/json.compiler.js';
import { NamespacedJsonCompiler } from '../compilers/namespaced-json.compiler.js';
import { PoCompiler } from '../compilers/po.compiler.js';
export class CompilerFactory {
    static create(format, options) {
        switch (format) {
            case 'pot':
                return new PoCompiler(options);
            case 'json':
                return new JsonCompiler(options);
            case 'namespaced-json':
                return new NamespacedJsonCompiler(options);
            default:
                throw new Error(`Unknown format: ${format}`);
        }
    }
}
//# sourceMappingURL=compiler.factory.js.map