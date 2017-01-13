import { expect } from 'chai';

import { TranslationCollection } from '../../src/utils/translation.collection';
import { NamespacedJsonCompiler } from '../../src/compilers/namespaced-json.compiler';

describe('NamespacedJsonCompiler', () => {

	let compiler: NamespacedJsonCompiler;

	beforeEach(() => {
		compiler = new NamespacedJsonCompiler();
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
		expect(collection.values).to.deep.equal({'NAMESPACE.KEY.FIRST_KEY': '', 'NAMESPACE.KEY.SECOND_KEY': 'VALUE' });
	});

	it('should unflatten keys on compile', () => {
		const collection = new TranslationCollection({
			'NAMESPACE.KEY.FIRST_KEY': '',
			'NAMESPACE.KEY.SECOND_KEY': 'VALUE'
		});
		const result: string = compiler.compile(collection);
		expect(result).to.equal('{\n\t"NAMESPACE": {\n\t\t"KEY": {\n\t\t\t"FIRST_KEY": "",\n\t\t\t"SECOND_KEY": "VALUE"\n\t\t}\n\t}\n}');
	});

});
