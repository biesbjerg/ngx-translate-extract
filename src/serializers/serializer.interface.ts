export interface SerializerInterface {

	serialize(messages: {[key: string]: string}): string;
	parse(contents: string): {[key: string]: string};

}
