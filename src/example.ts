import { Extractor } from './extractor';
import { JsonSerializer } from './serializers/json.serializer';

const serializer = new JsonSerializer();
// Or const serializer = new PotSerializer();
const extractor = new Extractor(serializer);

const src = '/your/project';
const dest = '/your/project/template.json';

try {
	const messages: string[] = extractor.extract(src);
	const output: string = extractor.save(dest);
	console.log({ messages, output });
} catch (e) {
	console.log(`Something went wrong: ${e.toString()}`);
}
