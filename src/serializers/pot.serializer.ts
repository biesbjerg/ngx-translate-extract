import { SerializerInterface, MessageType } from './serializer.interface';
import * as po2json from 'po2json';

export class PotSerializer implements SerializerInterface {

	protected _headers = {
		'Content-Type': 'text/plain; charset=utf-8',
		'Content-Transfer-Encoding': '8bit'
	};

	protected _buffer: string[] = [];

	public serialize(messages: MessageType): string {
		this._reset();
		this._addHeader(this._headers);
		this._addMessages(messages);

		return this._buffer.join('\n');
	}

	public parse(contents: string): MessageType {
		return po2json.parse(contents, {format: 'mf'});
	}

	protected _addHeader(headers: {}): void {
		this._add('msgid', '');
		this._add('msgstr', '');
		Object.keys(headers).forEach(key => {
			this._buffer.push(`"${key}: ${headers[key]}\\n"`);
		});
	}

	protected _addMessages(messages: MessageType): void {
		Object.keys(messages).forEach((key: string) => {
			this._add('msgid', key);
			this._add('msgstr', messages[key]);
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
