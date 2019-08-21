import { expect } from 'chai';

import { FunctionParser } from '../../src/parsers/function.parser';

describe('FunctionParser', () => {

	const componentFilename: string = 'test.component.ts';

	let parser: FunctionParser;

	beforeEach(() => {
		parser = new FunctionParser();
	});


	it('should extract strings using marker function', () => {
		const contents = `
			import { marker } from '@biesbjerg/ngx-translate-extract-marker';
			marker('Hello world', 'context1', 'comment1');
			marker(['I', 'am', 'extracted'], 'context2', 'comment2');
			otherFunction('But I am not');
			marker(message || 'binary expression');
			marker(message ? message : 'conditional operator');
			marker('FOO.bar');
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['Hello world', 'I', 'am', 'extracted', 'binary expression', 'conditional operator', 'FOO.bar']);
	});

});
