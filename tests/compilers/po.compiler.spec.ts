import { expect } from 'chai';

import { TranslationCollection } from '../../src/utils/translation.collection';
import { PoCompiler } from '../../src/compilers/po.compiler';

describe('PoCompiler', () => {
	let compiler: PoCompiler;

	beforeEach(() => {
		compiler = new PoCompiler();
	});

	it('should still include html ', () => {
		const collection = new TranslationCollection({
			'A <strong>test</strong>': 'Un <strong>test</strong>',
			'With a lot of <em>html</em> included': 'Avec beaucoup d\'<em>html</em> inclus'
		});
		const result: Buffer = Buffer.from(compiler.compile(collection));
		expect(result.toString('utf8')).to.equal('msgid ""\nmsgstr ""\n"mime-version: 1.0\\n"\n"Content-Type: text/plain; charset=utf-8\\n"\n"Content-Transfer-Encoding: 8bit\\n"\n\nmsgid "A <strong>test</strong>"\nmsgstr "Un <strong>test</strong>"\n\nmsgid "With a lot of <em>html</em> included"\nmsgstr "Avec beaucoup d\'<em>html</em> inclus"');
	});
});



