import { Container, interfaces } from 'inversify';
import { TYPES } from './types';
import { ParserInterface, ParserInterfaceWithConfig } from '../parsers/parser.interface';
import { ServiceParser } from '../parsers/service.parser';
import { DirectiveParser } from '../parsers/directive.parser';
import { PipeParser } from '../parsers/pipe.parser';
import { FunctionParser } from '../parsers/function.parser';
import { CompilerInterface } from '../compilers/compiler.interface';
import { JsonCompiler } from '../compilers/json.compiler';
import { PoCompiler } from '../compilers/po.compiler';
import { NamespacedJsonCompiler } from '../compilers/namespaced-json.compiler';
import { TaskInterface, ExtractTaskOptionsInterface } from '../cli/tasks/task.interface';
import { ExtractTask } from '../cli/tasks/extract.task';


const _container = new Container();

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
	container.bind<interfaces.Factory<ParserInterfaceWithConfig>>(TYPES.PARSER_WITH_CONFIG_FACTORY).toFactory<ParserInterfaceWithConfig>( (context: interfaces.Context) => {
		return (config: any) => {
			let parserInterfaceWithConfig = context.container.get<ParserInterfaceWithConfig>(TYPES.FUNCTION_PARSER);
			parserInterfaceWithConfig.config = config;
			return parserInterfaceWithConfig;
		};
	});
	container.bind<interfaces.Factory<CompilerInterface>>(TYPES.COMPILER_FACTORY).toFactory<CompilerInterface>( (context: interfaces.Context) => {
		return (format: string, config: any) => {
			let compiler = context.container.getNamed<CompilerInterface>(TYPES.COMPILER, format);
			compiler.config = config;
			return compiler;
		};
	});
	container.bind<interfaces.Factory<TaskInterface>>(TYPES.TASK_FACTORY).toFactory<TaskInterface>( (context: interfaces.Context) => {
		return (input: string[], output: string[], opts?: ExtractTaskOptionsInterface) => {
			let task = context.container.get<TaskInterface>(TYPES.TASK);
			task.setup(input, output, opts);
			return task;
		};
	});
};

export const setupCompilers = (container: Container, compilersConfig?: IoCCompilerConfig) => {
	// container.unbind for named is not implemented yet
	// as workaround unbind all classes and rebind compilerConfig first then add default compilers if not
	// already binded
	if (container.isBound(TYPES.COMPILER)) {
		container.unbind(TYPES.COMPILER);
	}

	if (compilersConfig !== undefined) {
		compilersConfig.compilers.forEach( (compiler) => {
			let selector: string = new compiler().selector;
			container.bind<CompilerInterface>(TYPES.COMPILER).to(compiler).whenTargetNamed(selector);
		});
	}

	defaultCompilersConfig.compilers.forEach( (compiler) => {
		let selector: string = new compiler().selector;
		if (!container.isBoundNamed(TYPES.COMPILER, selector)) {
			container.bind<CompilerInterface>(TYPES.COMPILER).to(compiler).whenTargetNamed(selector);
		}
	});
};

export const setupTask = (container: Container, extractTask: interfaces.Newable<TaskInterface>) => {
	if (container.isBound(TYPES.TASK)) {
		container.unbind(TYPES.TASK);
	}
	container.bind<TaskInterface>(TYPES.TASK).to(extractTask);
};


const defaultCompilersConfig: IoCCompilerConfig = {
	compilers: [JsonCompiler, NamespacedJsonCompiler, PoCompiler]
};

const parsersConfig: IoCParserConfig = {
	parsers: [{type: TYPES.SERVICE_PARSER, obj: ServiceParser},
			{type: TYPES.DIRECTIVE_PARSER, obj: DirectiveParser},
			{type: TYPES.PIPE_PARSER, obj: PipeParser}
	],
	parsersWithConfig: [{type: TYPES.FUNCTION_PARSER, obj: FunctionParser}]
};

setupParsers(_container, parsersConfig);
setupCompilers(_container);
setupTask(_container, ExtractTask);
configFactories(_container);

export const container = _container;
