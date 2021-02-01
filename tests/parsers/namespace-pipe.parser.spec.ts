import { expect } from 'chai';

import { NamespacePipeParser } from '../../src/parsers/namespace-pipe.parser';
import * as mockFs from 'mock-fs';

describe('NamespacePipeParser', () => {
	const templateFilename: string = 'test.template.html';

	let parser: NamespacePipeParser;

	beforeEach(() => {
		mockFs({ 'test.template.ts': tsWorking });
		parser = new NamespacePipeParser();
	});

	it('should throw error if no ts file with the same same as html file can be found', () => {
		try {
			const contents = `<div>{{"test"|namespaceTranslate}}</div>`;
			parser.extract(contents, 'no-matching-ts-file.html');
		} catch (err) {
			expect(err).not.undefined;
			expect(err).not.null;
		}
	});

	it('should not throw error if no ts file with the same same as html file can be found because namespaceTranslate not used', () => {
		const contents = `<div>{{"test"|translate}}</div>`;
		const keys = parser.extract(contents, 'no-matching-ts-file.html');
		expect(keys.values).to.deep.equal({});
	});

	it('should only extract string using pipe', () => {
		const contents = `<button [style.background]="'lime'">{{ 'SomeKey_NotWorking' | namespaceTranslate }}</button>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.SomeKey_NotWorking']);
	});

	it('should extract string using pipe, but between quotes only', () => {
		const contents = `<input class="form-control" type="text" placeholder="{{'user.settings.form.phone.placeholder' | namespaceTranslate}}" [formControl]="settingsForm.controls['phone']">`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.user.settings.form.phone.placeholder']);
	});

	it('should extract interpolated strings using namespaceTranslate pipe', () => {
		const contents = `Hello {{ 'World' | namespaceTranslate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.World']);
	});

	it('should extract interpolated strings when namespaceTranslate pipe is used before other pipes', () => {
		const contents = `Hello {{ 'World' | namespaceTranslate | upper }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.World']);
	});

	it('should extract interpolated strings when namespaceTranslate pipe is used after other pipes', () => {
		const contents = `Hello {{ 'World'  | upper | namespaceTranslate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.World']);
	});

	it('should extract strings from ternary operators inside interpolations', () => {
		const contents = `{{ (condition ? 'Hello' : 'World') | namespaceTranslate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Hello', 'test.World']);
	});

	it('should extract strings from ternary operators right expression', () => {
		const contents = `{{ condition ? null : ('World' | namespaceTranslate) }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.World']);
	});

	it('should extract strings from ternary operators inside attribute bindings', () => {
		const contents = `<span [attr]="condition ? null : ('World' | namespaceTranslate)"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.World']);
	});

	it('should extract strings from ternary operators left expression', () => {
		const contents = `{{ condition ? ('World' | namespaceTranslate) : null }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.World']);
	});

	it('should extract strings inside string concatenation', () => {
		const contents = `{{ 'a' + ('Hello' | namespaceTranslate) + 'b' + 'c' + ('World' | namespaceTranslate) + 'd' }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Hello', 'test.World']);
	});

	it('should extract strings from object', () => {
		const contents = `{{ { foo: 'Hello' | namespaceTranslate, bar: ['World' | namespaceTranslate], deep: { nested: { baz: 'Yes' | namespaceTranslate } } } | json }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Hello', 'test.World', 'test.Yes']);
	});

	it('should extract strings from ternary operators inside attribute bindings', () => {
		const contents = `<span [attr]="(condition ? 'Hello' : 'World') | namespaceTranslate"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Hello', 'test.World']);
	});

	it('should extract strings from nested expressions', () => {
		const contents = `<span [attr]="{ foo: ['a' + ((condition ? 'Hello' : 'World') | namespaceTranslate) + 'b'] }"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Hello', 'test.World']);
	});

	it('should extract strings from nested ternary operators ', () => {
		const contents = `<h3>{{ (condition ? 'Hello' : anotherCondition ? 'Nested' : 'World' ) | namespaceTranslate }}</h3>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Hello', 'test.Nested', 'test.World']);
	});

	it('should extract strings from ternary operators inside attribute interpolations', () => {
		const contents = `<span attr="{{(condition ? 'Hello' : 'World') | namespaceTranslate}}"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Hello', 'test.World']);
	});

	it('should extract strings with escaped quotes', () => {
		const contents = `Hello {{ 'World\\'s largest potato' | namespaceTranslate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([`test.World's largest potato`]);
	});

	it('should extract strings with multiple escaped quotes', () => {
		const contents = `{{ 'C\\'est ok. C\\'est ok' | namespaceTranslate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([`test.C'est ok. C'est ok`]);
	});

	it('should extract interpolated strings using namespaceTranslate pipe in attributes', () => {
		const contents = `<span attr="{{ 'Hello World' | namespaceTranslate }}"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Hello World']);
	});

	it('should extract bound strings using namespaceTranslate pipe in attributes', () => {
		const contents = `<span [attr]="'Hello World' | namespaceTranslate"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Hello World']);
	});

	it('should extract multiple entries from nodes', () => {
		const contents = `
			<ion-header>
				<ion-navbar color="brand">
					<ion-title>{{ 'Info' | namespaceTranslate }}</ion-title>
				</ion-navbar>
			</ion-header>

			<ion-content>

				<content-loading *ngIf="isLoading">
					{{ 'Loading...' | namespaceTranslate }}
				</content-loading>

			</ion-content>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Info', 'test.Loading...']);
	});

	it('should extract strings on same line', () => {
		const contents = `<span [attr]="'Hello' | namespaceTranslate"></span><span [attr]="'World' | namespaceTranslate"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Hello', 'test.World']);
	});

	it('should extract strings from this template', () => {
		const contents = `
			<ion-list inset>
				<ion-item>
					<ion-icon item-left name="person" color="dark"></ion-icon>
					<ion-input formControlName="name" type="text" [placeholder]="'Name' | namespaceTranslate"></ion-input>
				</ion-item>
				<ion-item>
					<p color="danger" danger *ngFor="let error of form.get('name').getError('remote')">
						{{ error }}
					</p>
				</ion-item>
			</ion-list>
			<div class="form-actions">
				<button ion-button (click)="onSubmit()" color="secondary" block>{{ 'Create account' | namespaceTranslate }}</button>
			</div>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.Name', 'test.Create account']);
	});

	it('should not extract variables', () => {
		const contents = '<p>{{ message | namespaceTranslate }}</p>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([]);
	});

	it('should be able to extract without html', () => {
		const contents = `{{ 'message' | namespaceTranslate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['test.message']);
	});

	it('should ignore calculated values', () => {
		const contents = `{{ 'SOURCES.' + source.name + '.NAME_PLURAL' | namespaceTranslate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([]);
	});

	it('should not extract pipe argument', () => {
		const contents = `{{ value | valueToTranslationKey: 'argument' | namespaceTranslate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([]);
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
