import { expect } from 'chai';

import { ServiceParser } from '../../src/parsers/service.parser';

class TestServiceParser extends ServiceParser {

}

describe('ServiceParser', () => {

	const componentFilename: string = 'test.component.ts';

	let parser: TestServiceParser;

	beforeEach(() => {
		parser = new TestServiceParser();
	});

	it('should support extracting binary expressions', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(protected _translateService: TranslateService) { }
				public test() {
					const message = 'The Message';
					this._translateService.get(message || 'Fallback message');
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['Fallback message']);
	});

	it('should support conditional operator', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(protected _translateService: TranslateService) { }
				public test() {
					const message = 'The Message';
					this._translateService.get(message ? message : 'Fallback message');
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['Fallback message']);
	});

	it('should extract strings in TranslateService\'s get() method', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(protected _translateService: TranslateService) { }
				public test() {
					this._translateService.get('Hello World');
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should extract strings in TranslateService\'s instant() method', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(protected _translateService: TranslateService) { }
				public test() {
					this._translateService.instant('Hello World');
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should extract strings in TranslateService\'s stream() method', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(protected _translateService: TranslateService) { }
				public test() {
					this._translateService.stream('Hello World');
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should extract array of strings in TranslateService\'s get() method', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(protected _translateService: TranslateService) { }
				public test() {
					this._translateService.get(['Hello', 'World']);
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['Hello', 'World']);
	});

	it('should extract array of strings in TranslateService\'s instant() method', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(protected _translateService: TranslateService) { }
				public test() {
					this._translateService.instant(['Hello', 'World']);
				}
		`;
		const key = parser.extract(contents, componentFilename).keys();
		expect(key).to.deep.equal(['Hello', 'World']);
	});

	it('should extract array of strings in TranslateService\'s stream() method', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(protected _translateService: TranslateService) { }
				public test() {
					this._translateService.stream(['Hello', 'World']);
				}
		`;
		const key = parser.extract(contents, componentFilename).keys();
		expect(key).to.deep.equal(['Hello', 'World']);
	});

	it('should not extract strings in get()/instant()/stream() methods of other services', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(
					protected _translateService: TranslateService,
					protected _otherService: OtherService
				) { }
				public test() {
					this._otherService.get('Hello World');
					this._otherService.instant('Hi there');
					this._otherService.stream('Hi there');
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal([]);
	});

	it('should extract strings with liberal spacing', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(
					protected _translateService: TranslateService,
					protected _otherService: OtherService
				) { }
				public test() {
					this._translateService.instant('Hello');
					this._translateService.get ( 'World' );
					this._translateService.instant ( ['How'] );
					this._translateService.get([ 'Are' ]);
					this._translateService.get([ 'You' , 'Today' ]);
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['Hello', 'World', 'How', 'Are', 'You', 'Today']);
	});

	it('should not extract string when not accessing property', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(protected trans: TranslateService) { }
				public test() {
					trans.get("You are expected at {{time}}", {time: moment.format('H:mm')}).subscribe();
				}
			}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal([]);
	});

	it('should extract string with params on same line', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(protected _translateService: TranslateService) { }
				public test() {
					this._translateService.get('You are expected at {{time}}', {time: moment.format('H:mm')});
				}
			}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['You are expected at {{time}}']);
	});

	it('should not crash when constructor parameter has no type', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(protected _translateService) { }
				public test() {
					this._translateService.instant('Hello World');
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal([]);
	});

	it('should extract strings from all classes in the file', () => {
		const contents = `
			import { Injectable } from '@angular/core';
			import { TranslateService } from '@ngx-translate/core';
			export class Stuff {
				thing: string;
				translate: any;
				constructor(thing: string) {
					this.translate.get('Not me');
					this.thing = thing;
				}
			}
			@Injectable()
			export class MyComponent {
				constructor(public translate: TranslateService) {
					this.translate.instant("Extract me!");
				}
			}
			export class OtherClass {
				constructor(thing: string, _translate: TranslateService) {
					this._translate.get("Do not extract me");
				}
			}
			@Injectable()
			export class AuthService {
				constructor(public translate: TranslateService) {
					this.translate.instant("Hello!");
				}
			}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['Extract me!', 'Hello!']);
	});

});
