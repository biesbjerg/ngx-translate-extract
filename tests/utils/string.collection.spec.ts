import { expect } from 'chai';

import { StringCollection } from '../../src/utils/string.collection';

describe('StringCollection', () => {

	let collection: StringCollection;

	beforeEach(() => {
		collection = new StringCollection();
	});

	it('should add item with value', () => {
		collection.add('key', 'translation');
		expect(collection.get('key')).to.equal('translation');
	});

	it('should add item with default value', () => {
		collection.add('key');
		expect(collection.get('key')).to.equal('');
	});

	it('should add array of items with default values', () => {
		collection.add(['key', 'key2']);
		expect(collection.count()).to.equal(2);
	});

	it('should remove item', () => {
		collection.add('key1').add('key2').remove('key1');
		expect(collection.count()).to.equal(1);
	});

	it('should return number of items', () => {
		collection.add('key1').add('key2');
		expect(collection.count()).to.equal(2);
	});

	it('should initialize with array of keys', () => {
		const newCollection = StringCollection.fromArray(['Hello', 'World']);
		expect(newCollection.count()).to.equal(2);
	});

	it('should initialize with key/value pairs', () => {
		const newCollection = StringCollection.fromObject({'key': 'translation'});
		expect(newCollection.get('key')).to.equal('translation');
	});

	it('should merge with other collection', () => {
		collection.add('Hello');
		const newCollection = StringCollection.fromArray(['World']);
		expect(collection.merge(newCollection).count()).to.equal(2);
	});

});
