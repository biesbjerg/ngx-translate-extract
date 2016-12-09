export interface StringType {
	[key: string]: string
};

export class StringCollection {

	public values: StringType = {};

	public static fromObject(values: StringType): StringCollection {
		const collection = new StringCollection();
		Object.keys(values).forEach(key => collection.add(key, values[key]));
		return collection;
	}

	public static fromArray(keys: string[]): StringCollection {
		const collection = new StringCollection();
		keys.forEach(key => collection.add(key));
		return collection;
	}

	public add(keys: string | string[], val: string = ''): StringCollection {
		if (!Array.isArray(keys)) {
			keys = [keys];
		}
		keys.forEach(key => this.values[key] = val);
		return this;
	}

	public remove(key: string): StringCollection {
		delete this.values[key];
		return this;
	}

	public merge(collection: StringCollection): StringCollection {
		this.values = Object.assign({}, this.values, collection.values);
		return this;
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

}
