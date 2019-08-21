export interface TranslationData {
	value: string;
	context?: string;
	reference?: string;
	comment?: string;
}

export interface TranslationType {
	[key: string]: TranslationData;
}

export class TranslationCollection {

	public values: TranslationType = {};

	public constructor(values: TranslationType = {}) {
		this.values = values;
	}

	public add(key: string, data: TranslationData ): TranslationCollection {
		return new TranslationCollection({ ...this.values, [key]: data });
	}

	public addKeys( keys: string[], data: TranslationData[] ): TranslationCollection {
		const values = keys.reduce((results, key, i) => {
			results[key] = data && data[ i ] ? data[ i ] : { value: '' };
			return results;
		}, {} as TranslationType);
		return new TranslationCollection({ ...this.values, ...values });
	}

	public remove(key: string): TranslationCollection {
		return this.filter(k => key !== k);
	}

	public forEach(callback: (key?: string, data?: TranslationData) => void): TranslationCollection {
		Object.keys(this.values).forEach(key => callback.call(this, key, this.values[key]));
		return this;
	}

	public filter(callback: (key?: string, data?: TranslationData) => boolean): TranslationCollection {
		let values: TranslationType = {};
		this.forEach((key: string, data: TranslationData) => {
			if (callback.call(this, key, data)) {
				values[key] = data;
			}
		});
		return new TranslationCollection(values);
	}

	public map(callback: (key?: string, data?: TranslationData) => string): TranslationCollection {
		let values: TranslationType = {};
		this.forEach((key: string, data: TranslationData) => {
			values[key] = callback.call(this, key, data);
		});
		return new TranslationCollection(values);
	}

	public union(collection: TranslationCollection): TranslationCollection {
		return new TranslationCollection({ ...this.values, ...collection.values });
	}

	public intersect(collection: TranslationCollection): TranslationCollection {
		let values: TranslationType = {};
		this.filter(key => collection.has(key))
			.forEach((key: string, data: TranslationData) => {
				values[key] = data;
			});

		return new TranslationCollection(values);
	}

	public has(key: string): boolean {
		return this.values.hasOwnProperty(key);
	}

	public get(key: string): TranslationData {
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

	public sort(compareFn?: (a: string, b: string) => number): TranslationCollection {
		let values: TranslationType = {};
		this.keys().sort(compareFn).forEach((key) => {
			values[key] = this.get(key);
		});

		return new TranslationCollection(values);
	}
}
