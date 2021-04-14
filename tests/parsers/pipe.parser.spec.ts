import { expect } from 'chai';

import { PipeParser } from '../../src/parsers/pipe.parser';

describe('PipeParser', () => {
	const templateFilename: string = 'test.template.html';

	let parser: PipeParser;

	beforeEach(() => {
		parser = new PipeParser();
	});

	it('should only extract string using pipe', () => {
		const contents = `<button [style.background]="'lime'">{{ 'SomeKey_NotWorking' | translate }}</button>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['SomeKey_NotWorking']);
	});

	it('should extract string using pipe, but between quotes only', () => {
		const contents = `<input class="form-control" type="text" placeholder="{{'user.settings.form.phone.placeholder' | translate}}" [formControl]="settingsForm.controls['phone']">`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['user.settings.form.phone.placeholder']);
	});

	it('should extract interpolated strings using translate pipe', () => {
		const contents = `Hello {{ 'World' | translate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['World']);
	});

	it('should extract interpolated strings when translate pipe is used before other pipes', () => {
		const contents = `Hello {{ 'World' | translate | upper }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['World']);
	});

	it('should extract interpolated strings when translate pipe is used after other pipes', () => {
		const contents = `Hello {{ 'World'  | upper | translate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['World']);
	});

	it('should extract strings from ternary operators inside interpolations', () => {
		const contents = `{{ (condition ? 'Hello' : 'World') | translate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello', 'World']);
	});

	it('should extract strings from ternary operators right expression', () => {
		const contents = `{{ condition ? null : ('World' | translate) }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['World']);
	});

	it('should extract strings from ternary operators inside attribute bindings', () => {
		const contents = `<span [attr]="condition ? null : ('World' | translate)"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['World']);
	});

	it('should extract strings from ternary operators left expression', () => {
		const contents = `{{ condition ? ('World' | translate) : null }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['World']);
	});

	it('should extract strings inside string concatenation', () => {
		const contents = `{{ 'a' + ('Hello' | translate) + 'b' + 'c' + ('World' | translate) + 'd' }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello', 'World']);
	});

	it('should extract strings from object', () => {
		const contents = `{{ { foo: 'Hello' | translate, bar: ['World' | translate], deep: { nested: { baz: 'Yes' | translate } } } | json }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello', 'World', 'Yes']);
	});

	it('should extract strings from ternary operators inside attribute bindings', () => {
		const contents = `<span [attr]="(condition ? 'Hello' : 'World') | translate"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello', 'World']);
	});

	it('should extract strings from nested expressions', () => {
		const contents = `<span [attr]="{ foo: ['a' + ((condition ? 'Hello' : 'World') | translate) + 'b'] }"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello', 'World']);
	});

	it('should extract strings from nested ternary operators ', () => {
		const contents = `<h3>{{ (condition ? 'Hello' : anotherCondition ? 'Nested' : 'World' ) | translate }}</h3>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello', 'Nested', 'World']);
	});

	it('should extract strings from ternary operators inside attribute interpolations', () => {
		const contents = `<span attr="{{(condition ? 'Hello' : 'World') | translate}}"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello', 'World']);
	});

	it('should extract strings with escaped quotes', () => {
		const contents = `Hello {{ 'World\\'s largest potato' | translate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([`World's largest potato`]);
	});

	it('should extract strings with multiple escaped quotes', () => {
		const contents = `{{ 'C\\'est ok. C\\'est ok' | translate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([`C'est ok. C'est ok`]);
	});

	it('should extract interpolated strings using translate pipe in attributes', () => {
		const contents = `<span attr="{{ 'Hello World' | translate }}"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should extract bound strings using translate pipe in attributes', () => {
		const contents = `<span [attr]="'Hello World' | translate"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should extract multiple entries from nodes', () => {
		const contents = `
			<ion-header>
				<ion-navbar color="brand">
					<ion-title>{{ 'Info' | translate }}</ion-title>
				</ion-navbar>
			</ion-header>

			<ion-content>

				<content-loading *ngIf="isLoading">
					{{ 'Loading...' | translate }}
				</content-loading>

			</ion-content>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Info', 'Loading...']);
	});

	it('should extract strings on same line', () => {
		const contents = `<span [attr]="'Hello' | translate"></span><span [attr]="'World' | translate"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello', 'World']);
	});

	it('should extract strings from this template', () => {
		const contents = `
			<ion-list inset>
				<ion-item>
					<ion-icon item-left name="person" color="dark"></ion-icon>
					<ion-input formControlName="name" type="text" [placeholder]="'Name' | translate"></ion-input>
				</ion-item>
				<ion-item>
					<p color="danger" danger *ngFor="let error of form.get('name').getError('remote')">
						{{ error }}
					</p>
				</ion-item>
			</ion-list>
			<div class="form-actions">
				<button ion-button (click)="onSubmit()" color="secondary" block>{{ 'Create account' | translate }}</button>
			</div>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Name', 'Create account']);
	});

	it('should not extract variables', () => {
		const contents = '<p>{{ message | translate }}</p>';
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([]);
	});

	it('should be able to extract without html', () => {
		const contents = `{{ 'message' | translate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['message']);
	});

	it('should ignore calculated values', () => {
		const contents = `{{ 'SOURCES.' + source.name + '.NAME_PLURAL' | translate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([]);
	});

	it('should not extract pipe argument', () => {
		const contents = `{{ value | valueToTranslationKey: 'argument' | translate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([]);
	});

	it('should extract strings from piped arguments inside a function calls on templates', () => {
		const contents = `{{ callMe('Hello' | translate, 'World' | translate ) }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([`Hello`, `World`]);
	});
});
