import { StringCollection } from '../utils/string.collection';

export interface SerializerInterface {

	serialize(collection: StringCollection): string;

}
