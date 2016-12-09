import { Extractor } from './extractor';
import { JsonCompiler } from './compilers/json.compiler';
import { TranslationCollection } from './utils/translation.collection';

const compiler = new JsonCompiler();
const extractor = new Extractor();

const dirPath = '/your/project';

try {
	const collection: TranslationCollection = extractor.process(dirPath);
	const result: string = compiler.compile(collection);
	console.log(result);
} catch (e) {
	console.log(`Something went wrong: ${e.toString()}`);
}
