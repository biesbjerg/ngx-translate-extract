import { expect } from 'chai';

import { TranslationCollection } from '../../src/utils/translation.collection';
import { JsonCompiler } from '../../src/compilers/json.compiler';

describe('JsonCompiler', () => {
	it("should construct without options", () => {
		expect(() => new JsonCompiler()).to.not.throw();
	});

	it('should compile to json', () => {
		const customCompiler = new JsonCompiler();
		const result: string = customCompiler.compile(testData());
		expect(result).to.equal('{\n\t"FIRST_KEY": "",\n\t"SECOND_KEY": "VALUE"\n}');
	});
	
	it('should add newline to end of file when requested', () => {
		const customCompiler = new JsonCompiler({
			newlineAtEndOfFile : true
		});
		const result: string = customCompiler.compile(testData());
		expect(result.endsWith('\n'))
			.to.equal(true, 'result should end with newline');
	});
	
	it('should use custom indentation chars', () => {
		const customCompiler = new JsonCompiler({
			indentation: '  '
		});
		const result: string = customCompiler.compile(testData());
		expect(result).to.equal('{\n  "FIRST_KEY": "",\n  "SECOND_KEY": "VALUE"\n}');
	});
	
	const testData = () => new TranslationCollection({
		'FIRST_KEY': '',
		'SECOND_KEY': 'VALUE'
	});
});