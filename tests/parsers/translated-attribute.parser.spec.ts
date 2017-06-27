import { expect } from 'chai';

import {TranslatedAttributeParser} from '../../src/parsers/translated-attribute.parser';


describe('TranslatedAttributeParser', () => {

	const templateFilename: string = 'test.template.html';

	let parser: TranslatedAttributeParser;

	beforeEach(() => {
		parser = new TranslatedAttributeParser(['label', 'help']);
	});

	it('should extract specified literal attributes', () => {
		const contents = `<form-control label="Person.name"></form-control>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Person.name']);
	});

	it('should not extract unspecified attributes', () => {
		const contents = `<form-control class="Person.name"></form-control>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([]);
	});

	it('should not extract non-literal attributes', () => {
		const contents = `<form-control [help]="dynamicHelp"></form-control>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([]);
	});

	it('should extract from multi-line elements', () => {
		const contents = `<form-control
			label="Person.name"
			help="Person.name.help">`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Person.name', 'Person.name.help']);
	});
});
