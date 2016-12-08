import { expect } from 'chai';

import { ServiceParser } from '../../src/parsers/service.parser';

class TestServiceParser extends ServiceParser {

	public extractTranslateServiceVar(contents: string): string {
		return this._extractTranslateServiceVar(contents);
	}

}

describe('ServiceParser', () => {

	const componentFilename: string = 'test.component.ts';

	let parser: TestServiceParser;

	beforeEach(() => {
		parser = new TestServiceParser();
	});

	it('should extract variable used for TranslateService', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(
					_serviceA: ServiceA,
					public _serviceB: ServiceB,
					protected _translateService: TranslateService
			) { }
		`;
		const messages = parser.extractTranslateServiceVar(contents);
		expect(messages).to.equal('_translateService');
	});

	it('should extract string passed to translateService.get()', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(protected _translateService: TranslateService) { }
				public test() {
					this._translateService.get('Hello World');
				}
		`;
		const messages = parser.process(componentFilename, contents);
		expect(messages).to.deep.equal(['Hello World']);
	});

	it('should extract string passed to translateService.instant()', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(protected _translateService: TranslateService) { }
				public test() {
					this._translateService.instant('Hello World');
				}
		`;
		const messages = parser.process(componentFilename, contents);
		expect(messages).to.deep.equal(['Hello World']);
	});

	it('should not extract string passed to get() or instant() methods of other services', () => {
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
		const messages = parser.process(componentFilename, contents);
		expect(messages).to.deep.equal([]);
	});

});
