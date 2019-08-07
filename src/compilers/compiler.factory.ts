import { CompilerInterface } from '../compilers/compiler.interface';
import { container } from '../ioc/inversify.config';
import { TYPES } from '../ioc/types';
import { interfaces } from 'inversify';

export class CompilerFactory {

	public static create(format: string, options?: any): CompilerInterface {
		let compilerFactory = container.get<interfaces.Factory<CompilerInterface>>(TYPES.COMPILER_FACTORY);
		let compiler = compilerFactory(format, options);
		return compiler as CompilerInterface;
	}

}
