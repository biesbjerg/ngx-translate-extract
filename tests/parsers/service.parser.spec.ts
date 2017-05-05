import { expect } from 'chai';

import { ServiceParser } from '../../src/parsers/service.parser';

class TestServiceParser extends ServiceParser {

	/*public getInstancePropertyName(): string {
		return this._getInstancePropertyName();
	}*/

}

describe('ServiceParser', () => {

	const componentFilename: string = 'test.component.ts';

	let parser: TestServiceParser;

	beforeEach(() => {
		parser = new TestServiceParser();
	});

	/*it('should extract variable used for TranslateService', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(
					_serviceA: ServiceA,
					public _serviceB: ServiceB,
					protected _translateService: TranslateService
			) { }
		`;
		const name = parser.getInstancePropertyName();
		expect(name).to.equal('_translateService');
	});*/

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

	it('should not extract strings in get()/instant() methods of other services', () => {
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

});
