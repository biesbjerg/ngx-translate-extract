import { CompilerInterface } from '../compilers/compiler.interface';
import { JsonCompiler } from '../compilers/json.compiler';
import { NamespacedJsonCompiler } from '../compilers/namespaced-json.compiler';
import { PoCompiler } from '../compilers/po.compiler';

export class CompilerFactory {

	public static create(format: string): CompilerInterface {
		switch (format) {
			case 'pot': return new PoCompiler();
			case 'json': return new JsonCompiler();
			case 'namespaced-json': return new NamespacedJsonCompiler();
			default: throw new Error(`Unknown format: ${format}`);
		}
	}

}
