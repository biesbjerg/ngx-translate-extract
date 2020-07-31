import { expect } from 'chai';

import { PostProcessorInterface } from '../../src/post-processors/post-processor.interface';
import { SortByKeyPostProcessor } from '../../src/post-processors/sort-by-key.post-processor';
import { TranslationCollection } from '../../src/utils/translation.collection';

const mock = {
	ZZ: 'last value',
	a: 'a value',
	'9': 'a numeric key',
	b: 'another value'
};


describe('SortByKeyPostProcessor', () => {
	let processor: PostProcessorInterface;
	let collection: TranslationCollection;
	let extracted: TranslationCollection;
	let existing: TranslationCollection;

	beforeEach(() => {
		collection = new TranslationCollection(mock);
		extracted = new TranslationCollection();
		existing = new TranslationCollection();
	});

	it('should sort keys alphanumerically (case sensitive)', () => {
		processor = new SortByKeyPostProcessor('');
		const sorted = processor.process(collection, extracted, existing).values;

		const sortedOutput = {
			'9': 'a numeric key',
			ZZ: 'last value',
			a: 'a value',
			b: 'another value'
		};

		expect(JSON.stringify(sorted)).to.deep.equal(JSON.stringify(sortedOutput));
	});

	it('should sort keys alphanumerically (case insensitive)', () => {
		processor = new SortByKeyPostProcessor('case-insensitive');
		const sorted = processor.process(collection, extracted, existing).values;

		const sortedOutput = {
			'9': 'a numeric key',
			a: 'a value',
			b: 'another value',
			ZZ: 'last value'
		};

		expect(JSON.stringify(sorted)).to.deep.equal(JSON.stringify(sortedOutput));
	});
});
