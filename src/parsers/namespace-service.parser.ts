import { TranslationCollection } from '../utils/translation.collection';
import { ServiceParser } from './service.parser';
import { extractNamespace } from '../utils/utils';

export class NamespaceServiceParser extends ServiceParser {
	protected TRANSLATE_SERVICE_TYPE_REFERENCE = 'NamespaceTranslateService';
	protected TRANSLATE_SERVICE_METHOD_NAMES = ['get', 'instant', 'stream'];

	public extract(source: string, filePath: string): TranslationCollection | null {
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
