let TYPES = {
	DirectiveParser: Symbol('ParserInterface'),
	ServiceParser: Symbol('ParserInterface'),
	PipeParser: Symbol('ParserInterface'),
	FunctionParser: Symbol('ParserInterface'),
	Compiler: Symbol('CompilerInterface'),
	ParserWithConfigFactory: Symbol('Factory<ParserInterfaceWithConfig>'),
	CompilerFactory: Symbol('Factory<CompilerFactory>')
};

export default TYPES;
