import { expect } from 'chai';

import { NamespaceServiceParser } from '../../src/parsers/namespace-service.parser';

describe('NamespaceServiceParser', () => {
	const componentFilename: string = 'test.component.ts';

	let parser: NamespaceServiceParser;

	beforeEach(() => {
		parser = new NamespaceServiceParser();
	});

	it('should extract strings when NamespaceTranslateService is accessed directly via constructor parameter', () => {
		const contents = `
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  				providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class MyComponent {
				public constructor(protected translateService: NamespaceTranslateService) {
					translateService.get('It works!');
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['test.It works!']);
	});

	it('should support extracting binary expressions', () => {
		const contents = `
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  				providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class AppComponent {
				public constructor(protected _translateService: NamespaceTranslateService) { }
				public test() {
					const message = 'The Message';
					this._translateService.get(message || 'Fallback message');
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['test.Fallback message']);
	});

	it('should support conditional operator', () => {
		const contents = `
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  				providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class AppComponent {
				public constructor(protected _translateService: NamespaceTranslateService) { }
				public test() {
					const message = 'The Message';
					this._translateService.get(message ? message : 'Fallback message');
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['test.Fallback message']);
	});

	it('should extract strings in NamespaceTranslateService\'s get() method', () => {
		const contents = `			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  			  providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class AppComponent {
				public constructor(protected _translateService: NamespaceTranslateService) { }
				public test() {
					this._translateService.get('Hello World');
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['test.Hello World']);
	});

	it('should extract strings in NamespaceTranslateService\'s instant() method', () => {
		const contents = `
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  			  providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class AppComponent {
				public constructor(protected _translateService: NamespaceTranslateService) { }
				public test() {
					this._translateService.instant('Hello World');
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['test.Hello World']);
	});

	it('should extract strings in NamespaceTranslateService\'s stream() method', () => {
		const contents = `
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  			  providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class AppComponent {
				public constructor(protected _translateService: NamespaceTranslateService) { }
				public test() {
					this._translateService.stream('Hello World');
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['test.Hello World']);
	});

	it('should extract array of strings in NamespaceTranslateService\'s get() method', () => {
		const contents = `
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  			  providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class AppComponent {
				public constructor(protected _translateService: NamespaceTranslateService) { }
				public test() {
					this._translateService.get(['Hello', 'World']);
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['test.Hello', 'test.World']);
	});

	it('should extract array of strings in NamespaceTranslateService\'s instant() method', () => {
		const contents = `
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  			  providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class AppComponent {
				public constructor(protected _translateService: NamespaceTranslateService) { }
				public test() {
					this._translateService.instant(['Hello', 'World']);
				}
		`;
		const key = parser.extract(contents, componentFilename).keys();
		expect(key).to.deep.equal(['test.Hello', 'test.World']);
	});

	it('should extract array of strings in NamespaceTranslateService\'s stream() method', () => {
		const contents = `
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  			  providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class AppComponent {
				public constructor(protected _translateService: NamespaceTranslateService) { }
				public test() {
					this._translateService.stream(['Hello', 'World']);
				}
		`;
		const key = parser.extract(contents, componentFilename).keys();
		expect(key).to.deep.equal(['test.Hello', 'test.World']);
	});

	it('should extract string arrays encapsulated in backticks', () => {
		const contents = `
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  			  providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class AppComponent {
				public constructor(protected _translateService: NamespaceTranslateService) { }
				public test() {
					this._translateService.get([\`Hello\`, \`World\`]);
				}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['test.Hello', 'test.World']);
	});

	it('should not extract strings in get()/instant()/stream() methods of other services', () => {
		const contents = `
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  			  providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class AppComponent {
				public constructor(
					protected _translateService: NamespaceTranslateService,
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
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  			  providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class AppComponent {
				public constructor(
					protected _translateService: NamespaceTranslateService,
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
		expect(keys).to.deep.equal(['test.Hello', 'test.World', 'test.How', 'test.Are', 'test.You', 'test.Today']);
	});

	it('should not extract string when not accessing property', () => {
		const contents = `
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  			  providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class AppComponent {
				public constructor(protected trans: NamespaceTranslateService) { }
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
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  			  providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class AppComponent {
				public constructor(protected _translateService: NamespaceTranslateService) { }
				public test() {
					this._translateService.get('You are expected at {{time}}', {time: moment.format('H:mm')});
				}
			}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['test.You are expected at {{time}}']);
	});

	it('should not crash when constructor parameter has no type', () => {
		const contents = `
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  			  providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
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
			import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
			@Component({
  			  providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
			})
			export class AppComponent {
				public constructor(protected translateService: NamespaceTranslateService) { }
				public test() {
					this.translateService.get(["yes", variable]).then(translations => {
						console.log(translations[variable]);
					});
				}
			}
		`;
		const keys = parser.extract(contents, componentFilename).keys();
		expect(keys).to.deep.equal(['test.yes']);
	});

	// it('should extract strings from all classes in the file', () => {
	// 	const contents = `
	// 		import { Injectable } from '@angular/core';
	// 		import { NamespaceTranslateService } from '@ngx-translate/core';
	// 		import { NamespaceServiceParser } from '../../src/parsers/namespace-service.parser';
	// 		export class Stuff {
	// 			thing: string;
	// 			translate: any;
	// 			constructor(thing: string) {
	// 				this.translate.get('Not me');
	// 				this.thing = thing;
	// 			}
	// 		}
	// 		@Injectable()
	// 		export class MyComponent {
	// 			constructor(public translate: NamespaceTranslateService) {
	// 				this.translate.instant("Extract me!");
	// 			}
	// 		}
	// 		export class OtherClass {
	// 			constructor(thing: string, _translate: NamespaceTranslateService) {
	// 				this._translate.get("Do not extract me");
	// 			}
	// 		}
	// 		@Injectable()
	// 		export class AuthService {
	// 			constructor(public translate: NamespaceTranslateService) {
	// 				this.translate.instant("Hello!");
	// 			}
	// 		}
	// 	`;
	// 	const keys = parser.extract(contents, componentFilename).keys();
	// 	expect(keys).to.deep.equal(['Extract me!', 'Hello!']);
	// });

	// it('should extract strings when NamespaceTranslateService is declared as a property', () => {
	// 	const contents = `
	// 		export class MyComponent {
	// 			protected translateService: NamespaceTranslateService;
	// 			public constructor() {
	// 				this.translateService = new NamespaceTranslateService();
	// 			}
	// 			public test() {
	// 				this.translateService.instant('Hello World');
	// 			}
	// 	`;
	// 	const keys = parser.extract(contents, componentFilename).keys();
	// 	expect(keys).to.deep.equal(['Hello World']);
	// });

	// it('should extract strings passed to TranslateServices methods only', () => {
	// 	const contents = `
	// 		import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";
	// 		@Component({
	// 			providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
	// 		})
	// 		export class AppComponent implements OnInit {
	// 			constructor(protected config: Config, protected translateService: NamespaceTranslateService) {}

	// 			public ngOnInit(): void {
	// 				this.localizeBackButton();
	// 			}

	// 			protected localizeBackButton(): void {
	// 				this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
	// 					this.config.set('backButtonText', this.translateService.instant('Back'));
	// 				});
	// 			}
	// 		}
	// 	`;
	// 	const keys = parser.extract(contents, componentFilename).keys();
	// 	expect(keys).to.deep.equal(['Back']);
	// });
});
