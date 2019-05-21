import cliHelper from './cli-helper';

describe('Cli Test (E2E)', () => {
	it('default format should extract successfully', async () => {
		const cliResult = await cliHelper.execute();
		cliResult.assertSuccess()
			.assertNoErrors()
			.assertOutputFileExists()
			.assertOutputContainsKeys('"Here are some links to help you start:": "Here are some links to help you start:",')
			.assertOutputContainsKeys('"welcome.title": "Welcome to [title]!"');
	});
});
