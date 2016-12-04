import { Extractor } from './extractor';
import { JsonSerializer } from './serializers/json.serializer';
import { PotSerializer } from './serializers/pot.serializer';

const dir = '/path/to/extract/strings/from';
const dest = '/path/to/save/template/to/template.pot';

const serializer = new JsonSerializer();
// Or const serializer = new PotSerializer();
const extractor = new Extractor(serializer);

try {
	const messages: string[] = extractor.extract(dir);
	const output: string = extractor.save(dest);
	console.log('Done!');
} catch (e) {
	console.log(`Something went wrong: ${e.toString()}`);
}
