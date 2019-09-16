import { expect } from 'chai';

import { MarkerParser } from '../../src/parsers/marker.parser';

describe('MarkerParser', () => {

	const componentFilename: string = 'test.component.ts';

	let parser: MarkerParser;

	beforeEach(() => {
		parser = new MarkerParser();
	});


	it('should extract strings using marker function', () => {
		const contents = `
			import { marker } from '@biesbjerg/ngx-translate-extract-marker';
			marker('Hello world');
			marker(['I', 'am', 'extracted']);
			otherFunction('But I am not');
			marker(message || 'binary expression');
			marker(message ? message : 'conditional operator');
			marker('FOO.bar');
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['Hello world', 'I', 'am', 'extracted', 'binary expression', 'conditional operator', 'FOO.bar']);
	});

	it('should extract split strings', () => {
		const contents = `
			import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
			_('Hello ' + 'world');
			_('This is a ' + 'very ' + 'very ' + 'very ' + 'very ' + 'long line.');
			_('Mix ' + \`of \` + 'different ' + \`types\`);
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal([
			'Hello world',
			'This is a very very very very long line.',
			'Mix of different types'
		]);
	});

});
