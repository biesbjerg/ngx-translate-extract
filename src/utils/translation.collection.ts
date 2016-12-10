export interface TranslationType {
	[key: string]: string
};

export class TranslationCollection {

	public values: TranslationType = {};

	public constructor(values: TranslationType = {}) {
		this.values = values;
	}

	public add(key: string, val: string = ''): TranslationCollection {
		return new TranslationCollection(Object.assign({}, this.values, { [key]: val }));
	}

	public addKeys(keys: string[]): TranslationCollection {
		const values = keys.reduce((results, key) => {
			results[key] = '';
			return results;
		}, <TranslationType>{});
		return new TranslationCollection(Object.assign({}, this.values, values));
	}

	public remove(key: string): TranslationCollection {
		let newCollection = new TranslationCollection();
		Object.keys(this.values).forEach(collectionKey => {
			if (key !== collectionKey) {
				newCollection = newCollection.add(key, this.values[key]);
			}
		});
		return newCollection;
	}

	public union(collection: TranslationCollection): TranslationCollection {
		return new TranslationCollection(Object.assign({}, this.values, collection.values));
	}

	public intersect(collection: TranslationCollection): TranslationCollection {
		let newCollection = new TranslationCollection();
		Object.keys(this.values).forEach(key => {
			if (collection.has(key)) {
				newCollection = newCollection.add(key, this.values[key]);
			}
		});
		return newCollection;
	}

	public has(key: string): boolean {
		return this.values.hasOwnProperty(key);
	}

	public get(key: string): string {
		return this.values[key];
	}

	public keys(): string[] {
		return Object.keys(this.values);
	}

	public count(): number {
		return Object.keys(this.values).length;
	}

	public isEmpty(): boolean {
		return Object.keys(this.values).length === 0;
	}

}
