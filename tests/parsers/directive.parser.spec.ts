import { expect } from 'chai';

import { DirectiveParser } from '../../src/parsers/directive.parser';

describe('DirectiveParser', () => {

	const templateFilename: string = 'test.template.html';
	const componentFilename: string = 'test.component.ts';

	let parser: DirectiveParser;

	beforeEach(() => {
		parser = new DirectiveParser();
	});

	it('should not choke when no html is present in template', () => {
		const contents = 'Hello World';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([]);
	});

	it('should use contents as key when there is no translate attribute value provided', () => {
		const contents = '<div translate>Hello World</div>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should use translate attribute value as key when provided', () => {
		const contents = '<div translate="MY_KEY">Hello World<div>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['MY_KEY']);
	});

	it('should not process children when translate attribute is present', () => {
		const contents = `<div translate>Hello <strong translate>World</strong></div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello <strong translate>World</strong>']);
	});

	it('should extract and parse inline template', () => {
		const contents = `
			@Component({
				selector: 'test',
				template: '<p translate-context="MY-----CONTEXT" translate>Hello World</p>'
			})
			export class TestComponent { }
		`;
		const keys = parser.extract(contents, componentFilename).keys();

		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should extract contents when no translate attribute value is provided', () => {
		const contents = '<div translate>Hello World</div>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should extract translate attribute value if provided', () => {
		const contents = '<div translate="KEY">Hello World<div>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['KEY']);
	});

	it('should not extract translate pipe in html tag', () => {
		const contents = `<p>{{ 'Audiobooks for personal development' | translate }}</p>`;
		const collection = parser.extract(contents, templateFilename);
		expect(collection.values).to.deep.equal({});
	});

	it('should extract contents from within custom tags', () => {
		const contents = `<custom-table><tbody><tr><td translate>Hello World</td></tr></tbody></custom-table>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should not cause error when no html is present in template', () => {
		const contents = `
			import { Component } from '@angular/core';
			@Component({
				template: '{{ variable }}'
			})
			export class MyComponent {
				variable: string
			}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal([]);
	});

});
