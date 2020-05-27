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

	it('should use element contents as key when no translate attribute value is present', () => {
		const contents = '<div translate>Hello World</div>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should use translate attribute value as key when present', () => {
		const contents = '<div translate="MY_KEY">Hello World<div>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['MY_KEY']);
	});

	it('should extract keys from child elements when translate attribute is present', () => {
		const contents = `<div translate>Hello <strong translate>World</strong></div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello', 'World']);
	});

	it('should not extract keys from child elements when translate attribute is not present', () => {
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

	it('should extract contents from custom elements', () => {
		const contents = `<custom-table><tbody><tr><td translate>Hello World</td></tr></tbody></custom-table>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should extract from template without leading/trailing whitespace', () => {
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

	it('should extract keys from element without leading/trailing whitespace', () => {
		const contents = `
			<div translate>
				this is an example
				of a long label
			</div>

			<div>
				<p translate>
					this is an example
					of another a long label
				</p>
			</div>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['this is an example of a long label', 'this is an example of another a long label']);
	});

	it('should collapse excessive whitespace', () => {
		const contents = '<p translate>this      is an example</p>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['this is an example']);
	});
});
