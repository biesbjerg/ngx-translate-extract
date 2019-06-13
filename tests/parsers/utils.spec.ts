import { expect } from 'chai';

import { isPathAngularComponent, extractComponentInlineTemplate } from '../../src/utils/utils';

describe('Utils', () => {

	it('should recognize js extension as angular component', () => {
		const result = isPathAngularComponent('test.js');
		expect(result).to.equal(true);
	});

	it('should recognize ts extension as angular component', () => {
		const result = isPathAngularComponent('test.ts');
		expect(result).to.equal(true);
	});

	it('should not recognize html extension as angular component', () => {
		const result = isPathAngularComponent('test.html');
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
		const template = extractComponentInlineTemplate(contents);
		expect(template).to.equal('<p translate>Hello World</p>');
	});

	it('should extract inline template without html', () => {
		const contents = `
			@Component({
				selector: 'test',
				template: '{{ "Hello World" | translate }}'
			})
			export class TestComponent { }
		`;
		const template = extractComponentInlineTemplate(contents);
		expect(template).to.equal('{{ "Hello World" | translate }}');
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
		const template = extractComponentInlineTemplate(contents);
		expect(template).to.equal('\n\t\t\t\t\t<p>\n\t\t\t\t\t\tHello World\n\t\t\t\t\t</p>\n\t\t\t\t');
	});

});
