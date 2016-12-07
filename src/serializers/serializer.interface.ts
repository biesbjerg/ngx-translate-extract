export type MessageType = { [key: string]: string };

export interface SerializerInterface {

	serialize(messages: MessageType): string;
	parse(contents: string): MessageType;

}
