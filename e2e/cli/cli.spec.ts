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
		const cliResult = await cliHelper.execute({prefillPattern: '???'});
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
});
