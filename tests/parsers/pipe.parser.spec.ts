import { expect } from 'chai';

import { PipeParser } from '../../src/parsers/pipe.parser';

describe('PipeParser', () => {

	const templateFilename: string = 'test.template.html';

	let parser: PipeParser;

	beforeEach(() => {
		parser = new PipeParser();
	});

	it('should extract interpolated strings using translate pipe', () => {
		const contents = `Hello {{ 'World' | translate }}`;
		const messages = parser.process(templateFilename, contents);
		expect(messages).to.deep.equal(['World']);
	});

	it('should extract interpolated strings using translate pipe in attributes', () => {
		const contents = `<span attr="{{ 'Hello World' | translate }}"></span>`;
		const messages = parser.process(templateFilename, contents);
		expect(messages).to.deep.equal(['Hello World']);
	});

	it('should extract bound strings using translate pipe in attributes', () => {
		const contents = `<span [attr]="'Hello World' | translate"></span>`;
		const messages = parser.process(templateFilename, contents);
		expect(messages).to.deep.equal(['Hello World']);
	});

});
