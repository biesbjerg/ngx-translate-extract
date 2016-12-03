import { SerializerInterface } from './serializer.interface';

export class JsonSerializer implements SerializerInterface {

	public serialize(messages: string[]): string {
		let result = {};
		messages.forEach(message => {
			result[message] = '';
		});

		return JSON.stringify(result, null, '\t');
	}

}
