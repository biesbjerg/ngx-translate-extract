import { Extractor } from './extractor';
import { JsonSerializer } from './serializers/json.serializer';
import { PotSerializer } from './serializers/pot.serializer';

const root = '/Users/kim/ionic/mindly-app/master/src';
const paths = [
	root + '/**/*.html',
	root + '/**/*.ts'
];
const destination = 'template.pot';

// const serializer = new JsonSerializer();
const serializer = new PotSerializer();
const extractor = new Extractor(serializer);

try {
	extractor.extract(paths);
	const output = extractor.save(destination);
	console.log(`Extracted strings to "${destination}"`);
	console.log();
	console.log('OUTPUT:');
	console.log(output);
} catch (e) {
	console.log(`Error extracting strings to "${destination}"`);
	throw e;
}
