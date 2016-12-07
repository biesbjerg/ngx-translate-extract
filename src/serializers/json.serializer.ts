import { SerializerInterface, MessageType } from './serializer.interface';

export class JsonSerializer implements SerializerInterface {

	public serialize(messages: MessageType): string {
		return JSON.stringify(messages, null, '\t');
	}

	public parse(contents: string): MessageType {
		return JSON.parse(contents);
	}

}
