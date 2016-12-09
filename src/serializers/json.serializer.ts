import { SerializerInterface } from './serializer.interface';
import { StringCollection } from '../utils/string.collection';

export class JsonSerializer implements SerializerInterface {

	public serialize(collection: StringCollection): string {
		return JSON.stringify(collection.values, null, '\t');
	}

}
