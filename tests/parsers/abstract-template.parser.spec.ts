import { expect } from 'chai';

import { AbstractTemplateParser } from '../../src/parsers/abstract-template.parser';

class TestTemplateParser extends AbstractTemplateParser {

	public isAngularComponent(filePath: string): boolean {
		return this._isAngularComponent(filePath);
	}

	public normalizeTemplateAttributes(template: string): string {
		return this._normalizeTemplateAttributes(template);
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

	it('should normalize bound attributes', () => {
		const contents = `<p [translate]="'KEY'">Hello World</p>`;
		const template = parser.normalizeTemplateAttributes(contents);
		expect(template).to.equal('<p translate="KEY">Hello World</p>');
	});

});
