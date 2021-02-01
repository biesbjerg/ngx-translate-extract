import { expect } from 'chai';
import * as mockFs from 'mock-fs';

import { DirectiveParser } from '../../src/parsers/directive.parser';
import { NamespaceDirectiveParser } from '../../src/parsers/namespace-directive.parser';

describe('NamespaceDirectiveParser', () => {
	const templateFilename: string = 'test.template.html';
	const componentFilename: string = 'test.component.ts';

	let parser: NamespaceDirectiveParser;

	beforeEach(() => {
		mockFs({ 'test.template.ts': tsWorking });
		parser = new NamespaceDirectiveParser();
	});

	it('should throw error if no ts file with the same same as html file can be found', () => {
		try {
			const contents = `<div [namespace-translate]="test"></div>`;
			parser.extract(contents, 'no-matching-ts-file.html');
		} catch (err) {
			expect(err).not.undefined;
			expect(err).not.null;
		}
	});

	it('should not throw error if no ts file with the same same as html file can be found because namespace-translate not used', () => {
		const contents = `<div [translate]="test"></div>`;
		const keys = parser.extract(contents, 'no-matching-ts-file.html');
		expect(keys.values).to.deep.equal({});
	});

	it('should extract keys when using literal map in bound attribute', () => {
		const contents = `<div [namespace-translate]="{ key1: 'value1' | translate, key2: 'value2' | translate }"></div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.value1', 'test.value2']);
	});

	it('should extract keys when using literal arrays in bound attribute', () => {
		const contents = `<div [namespace-translate]="[ 'value1' | translate, 'value2' | translate ]"></div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.value1', 'test.value2']);
	});

	it('should extract keys when using binding pipe in bound attribute', () => {
		const contents = `<div [namespace-translate]="'KEY1' | withPipe"></div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.KEY1']);
	});

	it('should extract keys when using binary expression in bound attribute', () => {
		const contents = `<div [namespace-translate]="keyVar || 'KEY1'"></div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.KEY1']);
	});

	it('should extract keys when using literal primitive in bound attribute', () => {
		const contents = `<div [namespace-translate]="'KEY1'"></div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.KEY1']);
	});

	it('should extract keys when using conditional in bound attribute', () => {
		const contents = `<div [namespace-translate]="condition ? 'KEY1' : 'KEY2'"></div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.KEY1', 'test.KEY2']);
	});

	it('should extract keys when using nested conditionals in bound attribute', () => {
		const contents = `<div [namespace-translate]="isSunny ? (isWarm ? 'Sunny and warm' : 'Sunny but cold') : 'Not sunny'"></div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Sunny and warm', 'test.Sunny but cold', 'test.Not sunny']);
	});

	it('should extract keys when using interpolation', () => {
		const contents = `<div namespace-translate="{{ 'KEY1' + key2 + 'KEY3' }}"></div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.KEY1', 'test.KEY3']);
	});

	it('should extract keys keeping proper whitespace', () => {
		const contents = `
			<div namespace-translate>
				Wubba
				Lubba
				Dub Dub
			</div>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Wubba Lubba Dub Dub']);
	});

	it('should use element contents as key when no translate attribute value is present', () => {
		const contents = '<div namespace-translate>Hello World</div>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Hello World']);
	});

	it('should use translate attribute value as key when present', () => {
		const contents = '<div namespace-translate="MY_KEY">Hello World<div>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.MY_KEY']);
	});

	it('should extract keys from child elements when translate attribute is present', () => {
		const contents = `<div namespace-translate>Hello <strong namespace-translate>World</strong></div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Hello', 'test.World']);
	});

	it('should not extract keys from child elements when translate attribute is not present', () => {
		const contents = `<div namespace-translate>Hello <strong>World</strong></div>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Hello']);
	});

	it('should extract and parse inline template', () => {
		const contents = `
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
				selector: 'test',
				template: '<p namespace-translate>Hello World</p>',
				providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class TestComponent { }
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['test.Hello World']);
	});

	it('should extract contents when no translate attribute value is provided', () => {
		const contents = '<div namespace-translate>Hello World</div>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Hello World']);
	});

	it('should extract translate attribute value if provided', () => {
		const contents = '<div namespace-translate="KEY">Hello World<div>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.KEY']);
	});

	it('should not extract translate pipe in html tag', () => {
		const contents = `<p>{{ 'Audiobooks for personal development' | translate }}</p>`;
		const collection = parser.extract(contents, templateFilename);
		expect(collection.values).to.deep.equal({});
	});

	it('should extract contents from custom elements', () => {
		const contents = `<custom-table><tbody><tr><td namespace-translate>Hello World</td></tr></tbody></custom-table>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Hello World']);
	});

	it('should extract from template without leading/trailing whitespace', () => {
		const contents = `
			<div *ngIf="!isLoading && studentsToGrid && studentsToGrid.length == 0" class="no-students" mt-rtl namespace-translate>There
				are currently no students in this class. The good news is, adding students is really easy! Just use the options
				at the top.
			</div>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([
			'test.There are currently no students in this class. The good news is, adding students is really easy! Just use the options at the top.'
		]);
	});

	it('should extract keys from element without leading/trailing whitespace', () => {
		const contents = `
			<div namespace-translate>
				this is an example
				of a long label
			</div>

			<div>
				<p namespace-translate>
					this is an example
					of another a long label
				</p>
			</div>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.this is an example of a long label', 'test.this is an example of another a long label']);
	});

	it('should collapse excessive whitespace', () => {
		const contents = '<p namespace-translate>this      is an example</p>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.this is an example']);
	});

	afterEach(() => {
		mockFs.restore();
	});
});

const tsWorking = `
    import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";

	@Component({
	  selector: 'app-nested',
	  templateUrl: './nested.component.html',
	  styleUrls: ['./nested.component.css'],
	  providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
	})
	export class NestedComponent implements OnInit {

	  constructor(@Self() nts: NamespaceTranslateService) { console.log(nts["namespace"]) }

	  ngOnInit(): void {
	  }

	}
`;
