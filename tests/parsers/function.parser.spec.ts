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
			import { _ } from '@biesbjerg/ngx-translate-extract';
			_('Hello world');
			_(['I', 'am', 'extracted']);
			otherFunction('But I am not');
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['Hello world', 'I', 'am', 'extracted']);
	});

	it('should extract split strings', () => {
		const contents = `
			import { _ } from '@biesbjerg/ngx-translate-extract';
			_('Hello ' + 'world');
			_('This is a ' + 'very ' + 'very ' + 'very ' + 'very ' + 'long line.');
			_('Mix ' + \`of \` + 'different ' + \`types\`);
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal([
			'Hello world',
			'This is a very very very very long line.',
			'Mix of different types',
		]);
	});

});
