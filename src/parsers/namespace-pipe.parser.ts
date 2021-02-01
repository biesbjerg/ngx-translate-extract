import { file } from 'mock-fs/lib/filesystem';
import { PipeParser } from './pipe.parser';
import { extractNamespace } from '../utils/utils';

export class NamespacePipeParser extends PipeParser {
	protected TRANSLATE_PIPE_NAME = 'namespaceTranslate';

	public extract(source: string, filePath: string) {
		const keys = super.extract(source, filePath);
		// only try to extract namespace if the namespaceTranslate pipe has been used.
		if (!keys || keys.isEmpty()) {
			return keys;
		}
		const namespace = extractNamespace(source, filePath);
		keys.prefixKeys(namespace);
		return keys;
	}
}
