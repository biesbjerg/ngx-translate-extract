import { expect } from 'chai';

import { PostProcessorInterface } from '../../src/post-processors/post-processor.interface';
import { PurgeObsoleteKeysPostProcessor } from '../../src/post-processors/purge-obsolete-keys.post-processor';
import { TranslationCollection } from '../../src/utils/translation.collection';

describe('KeyAsDefaultValuePostProcessor', () => {

	let processor: PostProcessorInterface;

	beforeEach(() => {
		processor = new PurgeObsoleteKeysPostProcessor();
	});

	it('should purge obsolete keys', () => {
		const collection = new TranslationCollection({
			'I am completely new': '',
			'I already exist': '',
			'I already exist but was not present in extract': ''
		});
		const extracted = new TranslationCollection({
			'I am completely new': '',
			'I already exist': ''
		});
		const existing = new TranslationCollection({
			'I already exist': '',
			'I already exist but was not present in extract': ''
		});

		expect(processor.process(collection, extracted, existing).values).to.deep.equal({
			'I am completely new': '',
			'I already exist': ''
		});
	});

});
