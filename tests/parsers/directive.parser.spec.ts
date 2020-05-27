import { expect } from 'chai';

import { DirectiveParser } from '../../src/parsers/directive.parser';

describe('DirectiveParser', () => {
	const templateFilename: string = 'test.template.html';
	const componentFilename: string = 'test.component.ts';

	let parser: DirectiveParser;

	beforeEach(() => {
		parser = new DirectiveParser();
	});

	it('should extract keys keeping proper whitespace', () => {
		const contents = `
			<div translate>
				Wubba
				Lubba
				Dub Dub
			</div>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Wubba Lubba Dub Dub']);
	});

	// Source: // https://github.com/ngx-translate/core/blob/7241c863b2eead26e082cd0b7ee15bac3f9336fc/projects/ngx-translate/core/tests/translate.directive.spec.ts#L93
	it('should extract keys the same way TranslateDirective is using them', () => {
		const contents = `<div #withOtherElements translate>TEST1 <span>Hey</span> TEST2</div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['TEST1', 'TEST2']);
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
		expect(keys).to.deep.equal(['Hello', 'World']);
	});

	it('should not exclude html tags in children', () => {
		const contents = `<div translate>Hello <strong>World</strong></div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello']);
	});

	it('should extract and parse inline template', () => {
		const contents = `
			@Component({
				selector: 'test',
				template: '<p translate>Hello World</p>'
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

	it('should extract contents without line breaks', () => {
		const contents = `
			<p translate>
				Please leave a message for your client letting them know why you
				rejected the field and what they need to do to fix it.
			</p>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([
			'Please leave a message for your client letting them know why you rejected the field and what they need to do to fix it.'
		]);
	});

	it('should extract contents without indent spaces', () => {
		const contents = `
			<div *ngIf="!isLoading && studentsToGrid && studentsToGrid.length == 0" class="no-students" mt-rtl translate>There
				are currently no students in this class. The good news is, adding students is really easy! Just use the options
				at the top.
			</div>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([
			'There are currently no students in this class. The good news is, adding students is really easy! Just use the options at the top.'
		]);
	});

	it('should extract contents without indent spaces and trim leading/trailing whitespace', () => {
		const contents = `
			<div translate>
				this is an example
				of a long label
			</div>

			<div>
				<p translate>
					this is an example
					of a long label
				</p>
			</div>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['this is an example of a long label']);
	});
});
