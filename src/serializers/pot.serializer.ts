import { SerializerInterface } from './serializer.interface';
import { StringCollection } from '../utils/string.collection';

export class PotSerializer implements SerializerInterface {

	protected _headers = {
		'Content-Type': 'text/plain; charset=utf-8',
		'Content-Transfer-Encoding': '8bit'
	};

	protected _buffer: string[] = [];

	public serialize(collection: StringCollection): string {
		this._reset();
		this._addHeader(this._headers);
		this._addMessages(collection);

		return this._buffer.join('\n');
	}

	protected _addHeader(headers: {}): void {
		this._add('msgid', '');
		this._add('msgstr', '');
		Object.keys(headers).forEach(key => {
			this._buffer.push(`"${key}: ${headers[key]}\\n"`);
		});
	}

	protected _addMessages(collection: StringCollection): void {
		Object.keys(collection.values).forEach(key => {
			this._add('msgid', key);
			this._add('msgstr', collection.get(key));
		});
	}

	protected _add(key: string, val: string): void {
		this._buffer.push(`${key} "${this._escape(val)}"`);
	}

	protected _reset(): void {
		this._buffer = [];
	}

	protected _escape(message: string): string {
		return message.replace(/"([^"\\]+)*"/g, '\\"$1\\"');
	}

}
