import { expect } from 'chai';

import { TranslationCollection } from '../../src/utils/translation.collection';
import { NamespacedJsonCompiler } from '../../src/compilers/namespaced-json.compiler';

describe('NamespacedJsonCompiler', () => {
	let compiler: NamespacedJsonCompiler;
	let eofNewlineCompiler: NamespacedJsonCompiler;

	beforeEach(() => {
		compiler = new NamespacedJsonCompiler();
		eofNewlineCompiler = new NamespacedJsonCompiler({ eofNewline: true });
	});

	it('should flatten keys on parse', () => {
		const contents = `
			{
				"NAMESPACE": {
					"KEY": {
						"FIRST_KEY": "",
						"SECOND_KEY": "VALUE"
					}
				}
			}
		`;
		const collection: TranslationCollection = compiler.parse(contents);
		expect(collection.values).to.deep.equal({
			'NAMESPACE.KEY.FIRST_KEY': '',
			'NAMESPACE.KEY.SECOND_KEY': 'VALUE'
		});
	});

	it('should unflatten keys on compile', () => {
		const collection = new TranslationCollection({
			'NAMESPACE.KEY.FIRST_KEY': '',
			'NAMESPACE.KEY.SECOND_KEY': 'VALUE'
		});
		const result: string = compiler.compile(collection);
		expect(result).to.equal('{\n\t"NAMESPACE": {\n\t\t"KEY": {\n\t\t\t"FIRST_KEY": "",\n\t\t\t"SECOND_KEY": "VALUE"\n\t\t}\n\t}\n}');
		const resultNewline: string = eofNewlineCompiler.compile(collection);
		expect(resultNewline).to.equal('{\n\t"NAMESPACE": {\n\t\t"KEY": {\n\t\t\t"FIRST_KEY": "",\n\t\t\t"SECOND_KEY": "VALUE"\n\t\t}\n\t}\n}\n');
	});

	it('should preserve numeric values on compile', () => {
		const collection = new TranslationCollection({
			'option.0': '',
			'option.1': '',
			'option.2': ''
		});
		const result: string = compiler.compile(collection);
		expect(result).to.equal('{\n\t"option": {\n\t\t"0": "",\n\t\t"1": "",\n\t\t"2": ""\n\t}\n}');
		const resultNewline: string = eofNewlineCompiler.compile(collection);
		expect(resultNewline).to.equal('{\n\t"option": {\n\t\t"0": "",\n\t\t"1": "",\n\t\t"2": ""\n\t}\n}\n');
	});

	it('should use custom indentation chars', () => {
		const collection = new TranslationCollection({
			'NAMESPACE.KEY.FIRST_KEY': '',
			'NAMESPACE.KEY.SECOND_KEY': 'VALUE'
		});
		const customCompiler = new NamespacedJsonCompiler({
			indentation: '  '
		});
		const result: string = customCompiler.compile(collection);
		expect(result).to.equal('{\n  "NAMESPACE": {\n    "KEY": {\n      "FIRST_KEY": "",\n      "SECOND_KEY": "VALUE"\n    }\n  }\n}');
	});

	it('should not reorder keys when compiled', () => {
		const collection = new TranslationCollection({
			BROWSE: '',
			LOGIN: ''
		});
		const result: string = compiler.compile(collection);
		expect(result).to.equal('{\n\t"BROWSE": "",\n\t"LOGIN": ""\n}');
		const resultNewline: string = eofNewlineCompiler.compile(collection);
		expect(resultNewline).to.equal('{\n\t"BROWSE": "",\n\t"LOGIN": ""\n}\n');
	});
});
