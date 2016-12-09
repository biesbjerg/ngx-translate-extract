import { Extractor } from './extractor';
import { JsonSerializer } from './serializers/json.serializer';
import { StringCollection } from './utils/string.collection';

const serializer = new JsonSerializer();
const extractor = new Extractor(serializer);

const src = '/your/project';
const dest = '/your/project/template.json';

try {
	const collection: StringCollection = extractor.process(src);
	const output: string = extractor.save(dest);
	console.log({ strings: collection.keys(), output: output });
} catch (e) {
	console.log(`Something went wrong: ${e.toString()}`);
}
