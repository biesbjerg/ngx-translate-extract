import cliHelper from './cli-helper';

describe('Cli Test (E2E)', () => {
	beforeEach(() => cliHelper.clean());

	it('default format should extract successfully', async () => {
		const cliResult = await cliHelper.execute();
		cliResult.assertSuccess()
			.assertNoErrors()
			.assertOutputFileExists()
			.assertOutputContainsKeys('"Here are some links to help you start:"')
			.assertOutputContainsKeys('"welcome.title"');
	});

	it('should extract new strings successfully but fill them up with a predefined text', async () => {
		const cliResult = await cliHelper.execute({prefillPattern: '???', keys: true});
		cliResult.assertSuccess()
			.assertNoErrors()
			.assertOutputFileExists()
			.assertOutputContainsKeys('"Here are some links to help you start:": "???",')
			.assertOutputContainsKeys('"welcome.title": "???"');
	});

	it('should extract new strings successfully with empty value', async () => {
		const cliResult = await cliHelper.execute({keys: true});
		cliResult.assertSuccess()
			.assertNoErrors()
			.assertOutputFileExists()
			.assertOutputContainsKeys('"Here are some links to help you start:": "",')
			.assertOutputContainsKeys('"welcome.title": ""');
	});

	it('should extract new strings successfully with value from extraction', async () => {
		const cliResult = await cliHelper.execute({keys: false});
		cliResult.assertSuccess()
			.assertNoErrors()
			.assertOutputFileExists()
			.assertOutputContainsKeys('"Here are some links to help you start:": "Here are some links to help you start:",')
			.assertOutputContainsKeys('"welcome.title": "Welcome to [title]!"');
	});

	it('should extract strings successfully with sorting enabled', async () => {
		const cliResult = await cliHelper.execute({sort: true});
		cliResult.assertSuccess()
			.assertNoErrors()
			.assertOutputFileExists()
			.assertOutputEquals('{\n' +
				'\t"Here are some links to help you start:": "Here are some links to help you start:",\n' +
				'\t"welcome.bottom": "Bottom Text",\n' +
				'\t"welcome.links.blog": "Angular blog",\n' +
				'\t"welcome.links.cli": "CLI Documentation",\n' +
				'\t"welcome.links.tour": "Tour of Heroes",\n' +
				'\t"welcome.title": "Welcome to [title]!"\n' +
				'}');
	});

	it('should merge existing strings successfully with sorting enabled', async () => {
		cliHelper.writeExistingOutputFile('{\n' +
			'\t"Here are some links to help you start:": "Already translated",\n' +
			'\t"welcome.links.tour": "Tour Link Already Translated"\n' +
			'}');
		const cliResult = await cliHelper.execute({sort: true});
		cliResult.assertSuccess()
			.assertNoErrors()
			.assertOutputFileExists()
			.assertOutputEquals('{\n' +
				'\t"Here are some links to help you start:": "Already translated",\n' +
				'\t"welcome.bottom": "Bottom Text",\n' +
				'\t"welcome.links.blog": "Angular blog",\n' +
				'\t"welcome.links.cli": "CLI Documentation",\n' +
				'\t"welcome.links.tour": "Tour Link Already Translated",\n' +
				'\t"welcome.title": "Welcome to [title]!"\n' +
				'}');
	});

	it('should merge existing strings successfully with sorting enabled and writing keys active', async () => {
		cliHelper.writeExistingOutputFile('{\n' +
			'\t"Here are some links to help you start:": "Already translated",\n' +
			'\t"welcome.links.tour": "Tour Link Already Translated"\n' +
			'}');
		const cliResult = await cliHelper.execute({sort: true, keys: true});
		cliResult.assertSuccess()
			.assertNoErrors()
			.assertOutputFileExists()
			.assertOutputEquals('{\n' +
				'\t"Here are some links to help you start:": "Already translated",\n' +
				'\t"welcome.bottom": "",\n' +
				'\t"welcome.links.blog": "",\n' +
				'\t"welcome.links.cli": "",\n' +
				'\t"welcome.links.tour": "Tour Link Already Translated",\n' +
				'\t"welcome.title": ""\n' +
				'}');
	});

	it('should merge existing strings successfully with sorting enabled and writing keys deactive and pattern active', async () => {
		cliHelper.writeExistingOutputFile('{\n' +
			'\t"Here are some links to help you start:": "Already translated",\n' +
			'\t"welcome.links.tour": "Tour Link Already Translated"\n' +
			'}');
		const cliResult = await cliHelper.execute({sort: true, keys: false, prefillPattern: '[???]'});
		cliResult.assertSuccess()
			.assertNoErrors()
			.assertOutputFileExists()
			.assertOutputEquals('{\n' +
				'\t"Here are some links to help you start:": "Already translated",\n' +
				'\t"welcome.bottom": "[???]Bottom Text",\n' +
				'\t"welcome.links.blog": "[???]Angular blog",\n' +
				'\t"welcome.links.cli": "[???]CLI Documentation",\n' +
				'\t"welcome.links.tour": "Tour Link Already Translated",\n' +
				'\t"welcome.title": "[???]Welcome to [title]!"\n' +
				'}');
	});
});
