const types = {
	DIRECTIVE_PARSER: Symbol('ParserInterface'),
	SERVICE_PARSER: Symbol('ParserInterface'),
	PIPE_PARSER: Symbol('ParserInterface'),
	FUNCTION_PARSER: Symbol('ParserInterface'),
	COMPILER: Symbol('CompilerInterface'),
	TASK: Symbol('TaskInterface'),
	PARSER_WITH_CONFIG_FACTORY: Symbol('Factory<ParserInterfaceWithConfig>'),
	COMPILER_FACTORY: Symbol('Factory<CompilerFactory>'),
	TASK_FACTORY: Symbol('Factory<TaskInterface>')
};

export const TYPES = types;
