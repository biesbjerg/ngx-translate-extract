import { expect } from 'chai';

import { PostProcessorInterface } from '../../src/post-processors/post-processor.interface.js';
import { NullAsDefaultValuePostProcessor } from '../../src/post-processors/null-as-default-value.post-processor.js';
import { TranslationCollection } from '../../src/utils/translation.collection.js';

describe('NullAsDefaultValuePostProcessor', () => {
	let processor: PostProcessorInterface;

	beforeEach(() => {
		processor = new NullAsDefaultValuePostProcessor();
	});

	it('should use null as default value', () => {
		const draft = new TranslationCollection({ 'String A': '' });
		const extracted = new TranslationCollection({ 'String A': '' });
		const existing = new TranslationCollection();
		expect(processor.process(draft, extracted, existing).values).to.deep.equal({
			'String A': null
		});
	});

	it('should keep existing value even if it is an empty string', () => {
		const draft = new TranslationCollection({ 'String A': '' });
		const extracted = new TranslationCollection({ 'String A': '' });
		const existing = new TranslationCollection({ 'String A': '' });
		expect(processor.process(draft, extracted, existing).values).to.deep.equal({
			'String A': ''
		});
	});

	it('should keep existing value', () => {
		const draft = new TranslationCollection({ 'String A': 'Streng A' });
		const extracted = new TranslationCollection({ 'String A': 'Streng A' });
		const existing = new TranslationCollection({ 'String A': 'Streng A' });
		expect(processor.process(draft, extracted, existing).values).to.deep.equal({
			'String A': 'Streng A'
		});
	});
});
