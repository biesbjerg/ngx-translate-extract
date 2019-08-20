import { interfaces } from 'inversify';
import { PostProcessorInterface } from '../../post-processors/post-processor.interface';
import { TaskInterface, ExtractTaskOptionsInterface } from './task.interface';
import { TYPES } from '../../ioc/types';
import { container } from '../../ioc/inversify.config';
import { ParserInterface, ParserInterfaceWithConfig } from '../../parsers/parser.interface';
import { CompilerInterface } from '../../compilers/compiler.interface';
import { CompilerFactory } from '../../compilers/compiler.factory';

export class TaskFactoryOptions {
	public replace: boolean = false;
	public patterns: string[] = ['/**/*.html', '/**/*.ts'];
	public postProcessors: PostProcessorInterface[] = [];
	public format: string;
	public marker: boolean = false;
	public formatIndentation: string = '\t';
}

export function createTask (input: string[], output: string[], options: TaskFactoryOptions): TaskInterface  {
	const extractTaskFactory = container.get<interfaces.Factory<TaskInterface>>(TYPES.TASK_FACTORY);
	const opts: ExtractTaskOptionsInterface = (({ replace, patterns }) => ({ replace, patterns }))(options);
	const extractTask = <TaskInterface> extractTaskFactory(input, output, opts);

	const parsers: ParserInterface[] = [container.get<ParserInterface>(TYPES.SERVICE_PARSER),
		container.get<ParserInterface>(TYPES.DIRECTIVE_PARSER),
		container.get<ParserInterface>(TYPES.PIPE_PARSER)];

	if (options.marker !== undefined ) {

		let functionParserFactory = container.get<interfaces.Factory<ParserInterfaceWithConfig>>(TYPES.PARSER_WITH_CONFIG_FACTORY);
		let functionParser = functionParserFactory({
			identifier: options.marker
		});
		parsers.push(<ParserInterface> functionParser);
	}
	extractTask.setParsers(parsers);
	extractTask.setPostProcessors(options.postProcessors);

	// Compiler
	const compiler: CompilerInterface = CompilerFactory.create(options.format, {
		indentation: options.formatIndentation
	});
	extractTask.setCompiler(compiler);

	return extractTask;
}
