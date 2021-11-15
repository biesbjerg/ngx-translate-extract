import { TranslationCollection } from '../../utils/translation.collection.js';
import { cyan, green, bold, dim, red } from 'colorette';
import pkg from 'glob';
const { sync } = pkg;
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
export class ExtractTask {
    inputs;
    outputs;
    options = {
        replace: false
    };
    parsers = [];
    postProcessors = [];
    compiler;
    constructor(inputs, outputs, options) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.inputs = inputs.map((input) => path.resolve(input));
        this.outputs = outputs.map((output) => path.resolve(output));
        this.options = { ...this.options, ...options };
    }
    execute() {
        if (!this.compiler) {
            throw new Error('No compiler configured');
        }
        this.printEnabledParsers();
        this.printEnabledPostProcessors();
        this.printEnabledCompiler();
        this.out(bold('Extracting:'));
        const extracted = this.extract();
        this.out(green(`\nFound %d strings.\n`), extracted.count());
        this.out(bold('Saving:'));
        this.outputs.forEach((output) => {
            let dir = output;
            let filename = `strings.${this.compiler.extension}`;
            if (!fs.existsSync(output) || !fs.statSync(output).isDirectory()) {
                dir = path.dirname(output);
                filename = path.basename(output);
            }
            const outputPath = path.join(dir, filename);
            let existing = new TranslationCollection();
            if (!this.options.replace && fs.existsSync(outputPath)) {
                try {
                    existing = this.compiler.parse(fs.readFileSync(outputPath, 'utf-8'));
                }
                catch (e) {
                    this.out(`%s %s`, dim(`- ${outputPath}`), red(`[ERROR]`));
                    throw e;
                }
            }
            const draft = extracted.union(existing);
            const final = this.process(draft, extracted, existing);
            try {
                let event = 'CREATED';
                if (fs.existsSync(outputPath)) {
                    this.options.replace ? (event = 'REPLACED') : (event = 'MERGED');
                }
                this.save(outputPath, final);
                this.out(`%s %s`, dim(`- ${outputPath}`), green(`[${event}]`));
            }
            catch (e) {
                this.out(`%s %s`, dim(`- ${outputPath}`), red(`[ERROR]`));
                throw e;
            }
        });
    }
    setParsers(parsers) {
        this.parsers = parsers;
        return this;
    }
    setPostProcessors(postProcessors) {
        this.postProcessors = postProcessors;
        return this;
    }
    setCompiler(compiler) {
        this.compiler = compiler;
        return this;
    }
    extract() {
        let collection = new TranslationCollection();
        this.inputs.forEach((pattern) => {
            this.getFiles(pattern).forEach((filePath) => {
                this.out(dim('- %s'), filePath);
                const contents = fs.readFileSync(filePath, 'utf-8');
                this.parsers.forEach((parser) => {
                    const extracted = parser.extract(contents, filePath);
                    if (extracted instanceof TranslationCollection) {
                        collection = collection.union(extracted);
                    }
                });
            });
        });
        return collection;
    }
    process(draft, extracted, existing) {
        this.postProcessors.forEach((postProcessor) => {
            draft = postProcessor.process(draft, extracted, existing);
        });
        return draft;
    }
    save(output, collection) {
        const dir = path.dirname(output);
        if (!fs.existsSync(dir)) {
            mkdirp.sync(dir);
        }
        fs.writeFileSync(output, this.compiler.compile(collection));
    }
    getFiles(pattern) {
        return sync(pattern).filter((filePath) => fs.statSync(filePath).isFile());
    }
    out(...args) {
        console.log.apply(this, arguments);
    }
    printEnabledParsers() {
        this.out(cyan('Enabled parsers:'));
        if (this.parsers.length) {
            this.out(cyan(dim(this.parsers.map((parser) => `- ${parser.constructor.name}`).join('\n'))));
        }
        else {
            this.out(cyan(dim('(none)')));
        }
        this.out();
    }
    printEnabledPostProcessors() {
        this.out(cyan('Enabled post processors:'));
        if (this.postProcessors.length) {
            this.out(cyan(dim(this.postProcessors.map((postProcessor) => `- ${postProcessor.constructor.name}`).join('\n'))));
        }
        else {
            this.out(cyan(dim('(none)')));
        }
        this.out();
    }
    printEnabledCompiler() {
        this.out(cyan('Compiler:'));
        this.out(cyan(dim(`- ${this.compiler.constructor.name}`)));
        this.out();
    }
}
//# sourceMappingURL=extract.task.js.map