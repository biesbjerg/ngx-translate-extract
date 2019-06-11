import { expect } from 'chai';

import { PostProcessorInterface } from '../../src/post-processors/post-processor.interface';
import { KeyAsDefaultValuePostProcessor } from '../../src/post-processors/key-as-default-value.post-processor';
import { TranslationCollection } from '../../src/utils/translation.collection';

describe('KeyAsDefaultValuePostProcessor', () => {

	let processor: PostProcessorInterface;

	beforeEach(() => {
		processor = new KeyAsDefaultValuePostProcessor();
	});

	it('should use key as default value', () => {
		const collection = new TranslationCollection({
			'I have no value': '',
			'I am already translated': 'Jeg er allerede oversat',
			'Use this key as value as well': ''
		});
		const extracted = new TranslationCollection();
		const existing = new TranslationCollection();

		expect(processor.process(collection, extracted, existing).values).to.deep.equal({
			'I have no value': 'I have no value',
			'I am already translated': 'Jeg er allerede oversat',
			'Use this key as value as well': 'Use this key as value as well'
		});
	});

});
