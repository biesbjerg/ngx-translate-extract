import { SerializerInterface } from './serializer.interface';

export class PotSerializer implements SerializerInterface {

	protected _headers = {
		'Content-Type': 'text/plain; charset=utf-8',
		'Content-Transfer-Encoding': '8bit'
	};

	protected _buffer: string[] = [];

	public serialize(messages: string[]): string {
		this._reset();
		this._addHeader(this._headers);
		this._addMessages(messages);

		return this._buffer.join('\n');
	}

	protected _addHeader(headers: {}): void {
		this._add('msgid', '');
		this._add('msgstr', '');
		Object.keys(headers).forEach(key => {
			this._buffer.push(`"${key}: ${headers[key]}\\n"`);
		});
	}

	protected _addMessages(messages: string[]): void {
		messages.forEach(message => {
			this._add('msgid', message);
			this._add('msgstr', '');
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
