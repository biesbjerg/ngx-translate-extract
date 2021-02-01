import { TranslationCollection } from '../utils/translation.collection';
import { extractNamespace } from '../utils/utils';
import { DirectiveParser } from './directive.parser';

export class NamespaceDirectiveParser extends DirectiveParser {
	protected TRANSLATE_ATTR_NAME = 'namespace-translate';

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
