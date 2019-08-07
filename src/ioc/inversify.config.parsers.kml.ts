import TYPES from './types';
import { Container } from 'inversify';

import { KmlServiceParser } from '../custom-parsers/kml.service.parser';
import { KmlDirectiveParser } from '../custom-parsers/kml.directive.parser';
import { KmlPipeParser } from '../custom-parsers/kml.pipe.parser';
import { KmlFunctionParser } from '../custom-parsers/kml.function.parser';


import { setupParsers, IoCParserConfig, IoCCompilerConfig, setupCompilers } from './inversify.config';
import { KmlCustomCompiler } from '../custom-compilers/kml-custom.compiler';

const parsersConfig: IoCParserConfig = {
	parsers: [{type: TYPES.ServiceParser, obj: KmlServiceParser},
			{type: TYPES.DirectiveParser, obj: KmlDirectiveParser},
			{type: TYPES.PipeParser, obj: KmlPipeParser}
	],
	parsersWithConfig: [{type: TYPES.FunctionParser, obj: KmlFunctionParser}]
};

const compilersConfig: IoCCompilerConfig = {
	compilers: [KmlCustomCompiler]
};

export const configCompilers = (container: Container) => { setupCompilers(container, compilersConfig); };

export const configParsers = (container: Container) => { setupParsers(container, parsersConfig); };
