import { ParserInterface } from '../../parsers/parser.interface';
import { CompilerInterface } from '../../compilers/compiler.interface';
import { PostProcessorInterface } from '../../post-processors/post-processor.interface';

export interface ExtractTaskOptionsInterface {
	replace?: boolean;
	patterns?: string[];
}

export interface TaskInterface {

	setup(input: string[], output: string[], opts?: ExtractTaskOptionsInterface): void;

	setParsers(parsers: ParserInterface[]): void;

	setCompiler(compiler: CompilerInterface): void;

	setPostProcessors(postProcessors: PostProcessorInterface[]): void;

	execute(): void;
}
