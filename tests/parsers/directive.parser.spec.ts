import { expect } from 'chai';

import { DirectiveParser } from '../../src/parsers/directive.parser';

describe('DirectiveParser', () => {

	const templateFilename: string = 'test.template.html';
	const componentFilename: string = 'test.component.ts';

	let parser: DirectiveParser;

	beforeEach(() => {
		parser = new DirectiveParser();
	});

	it('should extract contents when no translate attribute value is provided', () => {
		const contents = '<div translate>Hello World</div>';
		const messages = parser.process(templateFilename, contents);
		expect(messages).to.deep.equal(['Hello World']);
	});

	it('should extract translate attribute if provided', () => {
		const contents = '<div translate="KEY">Hello World<div>';
		const messages = parser.process(templateFilename, contents);
		expect(messages).to.deep.equal(['KEY']);
	});

	it('should extract bound translate attribute as key if provided', () => {
		const contents = `<div [translate]="'KEY'">Hello World<div>`;
		const messages = parser.process(templateFilename, contents);
		expect(messages).to.deep.equal(['KEY']);
	});

	it('should extract direct text nodes when no translate attribute value is provided', () => {
		const contents = `
			<div translate>
				<span>&#10003;</span>
				Hello <strong>World</strong>
				Hi <em>there</em>
			</div>
		`;
		const messages = parser.process(templateFilename, contents);
		expect(messages).to.deep.equal(['Hello', 'Hi']);
	});

	it('should extract direct text nodes of tags with a translate attribute', () => {
		const contents = `
			<div translate>
				<span>&#10003;</span>
				Hello World
				<div translate>Hi there</div>
			</div>
		`;
		const messages = parser.process(templateFilename, contents);
		expect(messages).to.deep.equal(['Hello World', 'Hi there']);
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
		const messages = parser.process(templateFilename, contents);
		expect(messages).to.deep.equal(['KEY', 'Hi there', 'OTHER_KEY']);
	});

	it('should extract and parse inline template', () => {
		const contents = `
			@Component({
				selector: 'test',
				template: '<p translate>Hello World</p>'
			})
			export class TestComponent { }
		`;
		const messages = parser.process(componentFilename, contents);
		expect(messages).to.deep.equal(['Hello World']);
	});

});
