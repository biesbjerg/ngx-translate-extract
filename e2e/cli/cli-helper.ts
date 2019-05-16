import { spawn } from 'child_process';
import { expect } from 'chai';
import { fail } from 'assert';

const fs = require('fs');

export class CliResult {
	private error: string[] = [];
	private output: string[] = [];
	private errorCode: number;

	constructor(private outputFolder: string) {
	}

	public addStdOut(data: string) {
		this.output.push(data);
	}

	public addError(data: string) {
		this.error.push(data);
	}

	public assertNoErrors(): CliResult {
		expect(this.error.length).to.eq(0);
		return this;
	}

	public setErrorCode(code: number) {
		this.errorCode = code;
	}

	public assertSuccess(): CliResult {
		expect(this.errorCode).to.eq(0, `The exit code of the CliHelper is not 0. ${this.detailedOutput()}`);
		return this;
	}

	public assertOutputFileExists(): CliResult {
		if (!fs.existsSync(this.outputFolder)) {
			fail(`Expect the output folder ${this.outputFolder} to exist`);
		}
		return this;
	}

	assertOutputContainsKeys(text: string): CliResult {
		const contents = fs.readFileSync(this.outputFolder, 'utf8');
		expect(contents).to.deep.include(text);
		return this;
	}

	private detailedOutput(): string {
		const stdOutput = this.output.join('\n');
		const errorOutput = this.error.join('\n');
		return `Stdout:\n${stdOutput}\n\nError:\n${errorOutput}`;
	}
}

export default {
	execute: (inputFolder = './example/demo-app/src', outputFolder = './example/i18n/test.json'): Promise<CliResult> => {
		let cli = spawn('node', ['./dist/index.js', '-i', inputFolder, '-o', outputFolder], {cwd: '.'});
		const result = new CliResult(outputFolder);
		const prom = new Promise<CliResult>(((resolve, reject) => {
			cli.stdout.on('data', (data: string) => {
				result.addStdOut(data);
			});

			cli.stderr.on('data', (data: string) => {
				result.addError(data);
			});

			cli.on('close', (code: number) => {
				result.setErrorCode(code);
				resolve(result);
			});
		}));

		return prom;

	}
};
