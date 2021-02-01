import { expect } from 'chai';
import * as mockFs from 'mock-fs';

import { extractNamespace } from '../../src/utils/utils';

describe('extractNamespace', () => {
	beforeEach(() => {
		mockFs({
			'working.ts': tsWorking,
			'ts.without.import': tsWithoutImport,
			'ts.without.namespaceCall': tsWithoutCall,
			'html.without.ts.html': '<div>{{"Test"|namespaceTranslate}}</div>',
			'html.with.ts.html': '<div>{{"Test"|namespaceTranslate}}</div>',
			'html.with.ts.ts': tsWorking
		});
	});

	it('should find namespace in ts file', () => {
		const namespace = extractNamespace(tsWorking, 'test.file.ts');
		expect(namespace).equal('test');
	});

	it('should find namespace in corresponding ts file of given html file', () => {
		const namespace = extractNamespace('<div>some html</div>', 'html.with.ts.html');
		expect(namespace).equal('test');
	});

	it('should find not find corresponding ts file', () => {
		try {
			extractNamespace(tsWithoutImport, 'html.without.ts.html');
		} catch (err) {
			expect(err).not.null;
			expect(err).not.undefined;
		}
	});

	it('should not find namespace import', () => {
		try {
			extractNamespace(tsWithoutImport, 'ts.without.import');
		} catch (err) {
			expect(err).not.null;
			expect(err).not.undefined;
		}
	});

	it('should not find namespace call', () => {
		try {
			extractNamespace(tsWithoutCall, 'ts.without.namespaceCall');
		} catch (err) {
			expect(err).not.null;
			expect(err).not.undefined;
		}
	});

	afterEach(() => {
		mockFs.restore();
	});
});

const tsWithoutImport = ``;

const tsWithoutCall = `import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";`;

const tsWorking = `
    import {TRANSLATION_NAMESPACE} from "@ngx-translate/core";

	@Component({
	  selector: 'app-nested',
	  templateUrl: './nested.component.html',
	  styleUrls: ['./nested.component.css'],
	  providers: [{ provide: TRANSLATION_NAMESPACE, useValue: "test" }, NamespaceTranslateService]
	})
	export class NestedComponent implements OnInit {

	  constructor(@Self() nts: NamespaceTranslateService) { console.log(nts["namespace"]) }

	  ngOnInit(): void {
	  }

	}
`;
