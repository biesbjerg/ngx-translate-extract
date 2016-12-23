import { expect } from 'chai';

import { AbstractTemplateParser } from '../../src/parsers/abstract-template.parser';

class TestTemplateParser extends AbstractTemplateParser {

	public isAngularComponent(filePath: string): boolean {
		return this._isAngularComponent(filePath);
	}

	public extractInlineTemplate(contents: string): string {
		return this._extractInlineTemplate(contents);
	}

}

describe('AbstractTemplateParser', () => {

	let parser: TestTemplateParser;

	beforeEach(() => {
		parser = new TestTemplateParser();
	});

	it('should recognize js extension as angular component', () => {
		const result = parser.isAngularComponent('test.js');
		expect(result).to.equal(true);
	});

	it('should recognize ts extension as angular component', () => {
		const result = parser.isAngularComponent('test.ts');
		expect(result).to.equal(true);
	});

	it('should not recognize html extension as angular component', () => {
		const result = parser.isAngularComponent('test.html');
		expect(result).to.equal(false);
	});

	it('should extract inline template', () => {
		const contents = `
			@Component({
				selector: 'test',
				template: '<p translate>Hello World</p>'
			})
			export class TestComponent { }
		`;
		const template = parser.extractInlineTemplate(contents);
		expect(template).to.equal('<p translate>Hello World</p>');
	});

	it('should extract inline template spanning multiple lines', () => {
		const contents = `
			@Component({
				selector: 'test',
				template: '
					<p>
						Hello World
					</p>
				',
				styles: ['
					p {
						color: red;
					}
				']
			})
			export class TestComponent { }
		`;
		const template = parser.extractInlineTemplate(contents);
		expect(template).to.equal('\n\t\t\t\t\t<p>\n\t\t\t\t\t\tHello World\n\t\t\t\t\t</p>\n\t\t\t\t');
	});

});
