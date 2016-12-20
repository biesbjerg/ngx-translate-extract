import { expect } from 'chai';

import { PipeParser } from '../../src/parsers/pipe.parser';

describe('PipeParser', () => {

	const templateFilename: string = 'test.template.html';

	let parser: PipeParser;

	beforeEach(() => {
		parser = new PipeParser();
	});

	it('should extract interpolated strings using translate pipe', () => {
		const contents = `Hello {{ 'World' | translate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['World']);
	});

	it('should extract strings with escaped quotes', () => {
		const contents = `Hello {{ 'World\'s largest potato' | translate }}`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal([`World's largest potato`]);
	});

	it('should extract interpolated strings using translate pipe in attributes', () => {
		const contents = `<span attr="{{ 'Hello World' | translate }}"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should extract bound strings using translate pipe in attributes', () => {
		const contents = `<span [attr]="'Hello World' | translate"></span>`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Hello World']);
	});

	it('should not use a greedy regular expression', () => {
		const contents = `
			<ion-header>
				<ion-navbar color="brand">
					<ion-title>{{ 'Info' | translate }}</ion-title>
				</ion-navbar>
			</ion-header>

			<ion-content>

				<content-loading *ngIf="isLoading">
					{{ 'Loading...' | translate }}
				</content-loading>

			</ion-content>
		`;
		const keys = parser.extract(contents, templateFilename).keys();
		expect(keys).to.deep.equal(['Info', 'Loading...']);
	});

});
