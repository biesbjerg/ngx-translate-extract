import { SerializerInterface } from './serializer.interface';

export class JsonSerializer implements SerializerInterface {

	public serialize(messages: {[key: string]: string}): string {
		return JSON.stringify(messages, null, '\t');
	}

	public parse(contents: string): {[key: string]: string} {
		return JSON.parse(contents);
	}

}
