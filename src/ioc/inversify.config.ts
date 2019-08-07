import { Container, interfaces } from 'inversify';
import TYPES from './types';
import { ParserInterface, ParserInterfaceWithConfig } from '../parsers/parser.interface';
import { ServiceParser } from '../parsers/service.parser';
import { DirectiveParser } from '../parsers/directive.parser';
import { PipeParser } from '../parsers/pipe.parser';
import { FunctionParser } from '../parsers/function.parser';
import { CompilerInterface } from '../compilers/compiler.interface';
import { JsonCompiler } from '../compilers/json.compiler';
import { PoCompiler } from '../compilers/po.compiler';
import { NamespacedJsonCompiler } from '../compilers/namespaced-json.compiler';
import { CustomCompiler } from '../compilers/custom.compiler';


const container = new Container();

export interface IoCParserConfig  {
	parsers: {type: symbol, obj: interfaces.Newable<ParserInterface>}[];
	parsersWithConfig: {type: symbol, obj: interfaces.Newable<ParserInterfaceWithConfig>}[];
}

export interface IoCCompilerConfig {
	compilers: interfaces.Newable<CompilerInterface>[]
}

export const setupParsers = (container: Container, parserConfig: IoCParserConfig ) => {
	parserConfig.parsers.forEach( (item) =>  {
		if (container.isBound(item.type)) {
			container.unbind(item.type);
		}
		container.bind<ParserInterface>(item.type).to(item.obj);
	});
	parserConfig.parsersWithConfig.forEach( item => {
		if (container.isBound(item.type)) {
			container.unbind(item.type);
		}
		container.bind<ParserInterfaceWithConfig>(item.type).to(item.obj);
	});
};

export const configFactories = (container: Container) => {
	container.bind<interfaces.Factory<ParserInterfaceWithConfig>>(TYPES.ParserWithConfigFactory).toFactory<ParserInterfaceWithConfig>( (context: interfaces.Context) => {
		return (config: any) => {
			let parserInterfaceWithConfig = context.container.get<ParserInterfaceWithConfig>(TYPES.FunctionParser);
			parserInterfaceWithConfig.config = config;
			return parserInterfaceWithConfig;
		};
	});
	container.bind<interfaces.Factory<CompilerInterface>>(TYPES.CompilerFactory).toFactory<CompilerInterface>( (context: interfaces.Context) => {
		return (format: string, config: any) => {
			let compiler = context.container.getNamed<CompilerInterface>(TYPES.Compiler, format);
			compiler.config = config;
			return compiler;
		};
	});
};

export const setupCompilers = (container: Container, compilersConfig?: IoCCompilerConfig) => {
	// container.unbind for named is not implemented yet
	// as workaround unbind all classes and rebind compilerConfig first then add default compilers if not
	// already binded
	if (container.isBound(TYPES.Compiler)) {
		container.unbind(TYPES.Compiler);
	}

	if (compilersConfig !== undefined) {
		compilersConfig.compilers.forEach( (compiler) => {
			let selector: string = new compiler().selector;
			container.bind<CompilerInterface>(TYPES.Compiler).to(compiler).whenTargetNamed(selector);
		});
	}

	defaultCompilersConfig.compilers.forEach( (compiler) => {
		let selector: string = new compiler().selector;
		if (!container.isBoundNamed(TYPES.Compiler,selector)) {
			container.bind<CompilerInterface>(TYPES.Compiler).to(compiler).whenTargetNamed(selector);
		}
	});
};

const defaultCompilersConfig: IoCCompilerConfig = {
	compilers: [JsonCompiler, NamespacedJsonCompiler, PoCompiler, CustomCompiler]
};

const parsersConfig: IoCParserConfig = {
	parsers: [{type: TYPES.ServiceParser, obj: ServiceParser},
			{type: TYPES.DirectiveParser, obj: DirectiveParser},
			{type: TYPES.PipeParser, obj: PipeParser}
	],
	parsersWithConfig: [{type: TYPES.FunctionParser, obj: FunctionParser}]
};

setupParsers(container, parsersConfig);
setupCompilers(container);
configFactories(container);

export default container;
