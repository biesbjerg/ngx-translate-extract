import { expect } from 'chai';

import { DirectiveParser } from '../../src/parsers/directive.parser';

class TestDirectiveParser extends DirectiveParser {

	public normalizeTemplateAttributes(template: string): string {
		return super.normalizeTemplateAttributes(template);
	}

}

describe('DirectiveParser', () => {

	const templateFilename: string = 'test.template.html';
	const componentFilename: string = 'test.component.ts';

	let parser: TestDirectiveParser;

	beforeEach(() => {
		parser = new TestDirectiveParser();
	});

	it('should extract contents when no translate attribute value is provided', () => {
		const contents = '<div translate>Hello World</div>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should extract translate attribute if provided', () => {
		const contents = '<div translate="KEY">Hello World<div>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['KEY']);
	});

	it('should extract bound translate attribute as key if provided', () => {
		const contents = `<div [translate]="'KEY'">Hello World<div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['KEY']);
	});

	it('should extract direct text nodes when no translate attribute value is provided', () => {
		const contents = `
			<div translate>
				<span>&#10003;</span>
				Hello <strong>World</strong>
				Hi <em>there</em>
			</div>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello', 'Hi']);
	});

	it('should extract direct text nodes of tags with a translate attribute', () => {
		const contents = `
			<div translate>
				<span>&#10003;</span>
				Hello World
				<div translate>Hi there</div>
			</div>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello World', 'Hi there']);
	});

	it('should extract translate attribute if provided or direct text nodes if not', () => {
		const contents = `
			<div translate="KEY">
				<span>&#10003;</span>
				Hello World
				<p translate>Hi there</p>
				<p [translate]="'OTHER_KEY'">Lorem Ipsum</p>
			</div>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['KEY', 'Hi there', 'OTHER_KEY']);
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

	it('should extract contents when no ng2-translate attribute value is provided', () => {
		const contents = '<div ng2-translate>Hello World</div>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should extract ng2-translate attribute if provided', () => {
		const contents = '<div ng2-translate="KEY">Hello World<div>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['KEY']);
	});

	it('should extract bound ng2-translate attribute as key if provided', () => {
		const contents = `<div [ng2-translate]="'KEY'">Hello World<div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['KEY']);
	});

	it('should not extract translate pipe in html tag', () => {
		const contents = `<p>{{ 'Audiobooks for personal development' | translate }}</p>`;
		const collection = parser.extract(contents, templateFilename);
		expect(collection.values).to.deep.equal({});
	});

	it('should normalize bound attributes', () => {
		const contents = `<p [translate]="'KEY'">Hello World</p>`;
		const template = parser.normalizeTemplateAttributes(contents);
		expect(template).to.equal('<p translate="KEY">Hello World</p>');
	});

	it('should extract contents from within custom tags', () => {
		const contents = `<custom-table><tbody><tr><td translate>Hello World</td></tr></tbody></custom-table>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

});
