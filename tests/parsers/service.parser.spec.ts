import { expect } from 'chai';

import { ServiceParser } from '../../src/parsers/service.parser';

describe('ServiceParser', () => {
	const componentFilename: string = 'test.component.ts';

	let parser: ServiceParser;

	beforeEach(() => {
		parser = new ServiceParser();
	});

	it('should extract strings when TranslateService is accessed directly via constructor parameter', () => {
		const contents = `
			@Component({ })
			export class MyComponent {
				public constructor(protected translateService: TranslateService) {
					translateService.get('It works!');
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['It works!']);
	});

	it('should extract strings when TranslateService is accessed directly via constructor parameter, when custom service name is used', () => {
		const contents = `
			@Component({ })
			export class MyComponent {
				public constructor(protected translateService: AdvancedTranslateService) {
					translateService.get('It works!');
				}
		`;
		const keys = new ServiceParser('AdvancedTranslateService').extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['It works!']);
	});

	it('should extract strings when TranslateService is accessed directly via constructor parameter, when custom service name is used, with custom service method names', () => {
		const contents = `
			@Component({ })
			export class MyComponent {
				public constructor(protected translateService: AdvancedTranslateService) {
					translateService.get('It works!');
					translateService.instant('It works 2!');
					translateService.someBrandNewMethod('It works 3!');
				}
		`;
		const keys = new ServiceParser('AdvancedTranslateService', ['get', 'someBrandNewMethod', 'instant'])
			.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['It works!', 'It works 2!', 'It works 3!']);
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

	it("should extract strings in TranslateService's instant() method", () => {
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

	it("should extract strings in TranslateService's stream() method", () => {
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

	it("should extract array of strings in TranslateService's get() method", () => {
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

	it("should extract array of strings in TranslateService's instant() method", () => {
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

	it("should extract array of strings in TranslateService's stream() method", () => {
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

	it('should extract string arrays encapsulated in backticks', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(protected _translateService: TranslateService) { }
				public test() {
					this._translateService.get([\`Hello\`, \`World\`]);
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['Hello', 'World']);
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

	it('should not extract variables', () => {
		const contents = `
			@Component({ })
			export class AppComponent {
				public constructor(protected translateService: TranslateService) { }
				public test() {
					this.translateService.get(["yes", variable]).then(translations => {
						console.log(translations[variable]);
					});
				}
			}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['yes']);
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

	it('should extract strings when TranslateService is declared as a property', () => {
		const contents = `
			export class MyComponent {
				protected translateService: TranslateService;
				public constructor() {
					this.translateService = new TranslateService();
				}
				public test() {
					this.translateService.instant('Hello World');
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should extract strings passed to TranslateServices methods only', () => {
		const contents = `
			export class AppComponent implements OnInit {
				constructor(protected config: Config, protected translateService: TranslateService) {}

				public ngOnInit(): void {
					this.localizeBackButton();
				}

				protected localizeBackButton(): void {
					this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
						this.config.set('backButtonText', this.translateService.instant('Back'));
					});
				}
			}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['Back']);
	});
});
