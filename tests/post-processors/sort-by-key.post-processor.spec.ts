import { expect } from 'chai';

import { PostProcessorInterface } from '../../src/post-processors/post-processor.interface';
import { SortByKeyPostProcessor } from '../../src/post-processors/sort-by-key.post-processor';
import { TranslationCollection } from '../../src/utils/translation.collection';

describe('SortByKeyPostProcessor', () => {

	let processor: PostProcessorInterface;

	beforeEach(() => {
		processor = new SortByKeyPostProcessor();
	});

	it('should sort keys alphanumerically', () => {
		const collection = new TranslationCollection({
			'z': 'last value',
			'a': 'a value',
			'9': 'a numeric key',
			'b': 'another value'
		});
		const extracted = new TranslationCollection();
		const existing = new TranslationCollection();

		expect(processor.process(collection, extracted, existing).values).to.deep.equal({
			'9': 'a numeric key',
			'a': 'a value',
			'b': 'another value',
			'z': 'last value'
		});
	});

});
