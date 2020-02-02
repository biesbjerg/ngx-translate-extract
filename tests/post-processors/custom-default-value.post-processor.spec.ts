import { expect } from 'chai';

import { PostProcessorInterface } from '../../src/post-processors/post-processor.interface';
import { CustomDefaultValuePostProcessor } from '../../src/post-processors/custom-default-value.post-processor';
import { TranslationCollection } from '../../src/utils/translation.collection';

describe('CustomDefaultValuePostProcessor', () => {
	let processor: PostProcessorInterface;

	it('should keep the same value', () => {
		processor = new CustomDefaultValuePostProcessor('Missing translation');
		const collection = new TranslationCollection({ 'existing.value': 'Hello' });

		expect(processor.process(collection).values).to.deep.equal({
			'existing.value': 'Hello'
		});
	});

	it('should use the custom default value', () => {
		processor = new CustomDefaultValuePostProcessor('');
		const collection = new TranslationCollection({ 'no.value': '' });

		expect(processor.process(collection).values).to.deep.equal({
			'no.value': 'Missing translation'
		});
	});

	it('should use the custom value', () => {
		processor = new CustomDefaultValuePostProcessor('Missing');
		const collection = new TranslationCollection({ 'no.value': '' });

		expect(processor.process(collection).values).to.deep.equal({
			'no.value': 'Missing'
		});
	});
});
