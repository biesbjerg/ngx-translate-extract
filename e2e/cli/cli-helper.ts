import { spawn } from 'child_process';
import { expect } from 'chai';
import { fail } from 'assert';

const fs = require('fs-extra');

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

	public assertOutputContainsKeys(text: string): CliResult {
		const contents = fs.readFileSync(this.outputFolder, 'utf8');
		expect(contents).to.deep.include(text);
		return this;
	}


	public assertOutputEquals(content: string) {
		const contents = fs.readFileSync(this.outputFolder, 'utf8');
		expect(contents).to.eq(content);
		return this;
	}

	private detailedOutput(): string {
		const stdOutput = this.output.join('\n');
		const errorOutput = this.error.join('\n');
		return `Stdout:\n${stdOutput}\n\nError:\n${errorOutput}`;
	}
}

interface CliOptions {
	outputFile: string;
	outputFolder: string;
	inputFolder: string;
	prefillPattern: string;
	keys: boolean;
	verbose: boolean;
	sort: boolean;
}

const defaultOptions: CliOptions = {
	inputFolder: './example/demo-app/src',
	outputFile: './example/i18n/test.json',
	outputFolder: './example/i18n/',
	prefillPattern: undefined,
	keys: false,
	verbose: false,
	sort: false,
};

export default {
	clean: (cliOptions: Partial<CliOptions> = {}) => {
		cliOptions = {...defaultOptions, ...cliOptions};
		fs.removeSync(cliOptions.outputFolder);
	},
	writeExistingOutputFile: (content: string) => {
		fs.outputFileSync(defaultOptions.outputFile, content);
	},
	execute: (cliOptions: Partial<CliOptions> = {}): Promise<CliResult> => {
		cliOptions = {...defaultOptions, ...cliOptions};
		const args = ['./dist/index.js', '-i', cliOptions.inputFolder, '-o', cliOptions.outputFile];

		if (cliOptions.prefillPattern) {
			args.push('--pp', cliOptions.prefillPattern);
		}

		if (cliOptions.keys === true) {
			args.push('-k', 'true');
		}
		if (cliOptions.sort) {
			args.push('-s');
		}
		if (cliOptions.verbose) {
			args.push('-vb');
		}

		let cli = spawn('node', args, {cwd: '.'});
		const result = new CliResult(cliOptions.outputFile);
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
