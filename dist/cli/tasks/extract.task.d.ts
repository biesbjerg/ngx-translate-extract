import { TranslationCollection } from '../../utils/translation.collection';
import { TaskInterface } from './task.interface';
import { ParserInterface } from '../../parsers/parser.interface';
import { CompilerInterface } from '../../compilers/compiler.interface';
export interface ExtractTaskOptionsInterface {
    replace?: boolean;
    sort?: boolean;
    clean?: boolean;
    patterns?: string[];
    verbose?: boolean;
}
export declare class ExtractTask implements TaskInterface {
    protected _input: string[];
    protected _output: string[];
    protected _options: ExtractTaskOptionsInterface;
    protected _parsers: ParserInterface[];
    protected _compiler: CompilerInterface;
    constructor(_input: string[], _output: string[], options?: ExtractTaskOptionsInterface);
    execute(): void;
    setParsers(parsers: ParserInterface[]): this;
    setCompiler(compiler: CompilerInterface): this;
    protected _extract(): TranslationCollection;
    protected _save(collection: TranslationCollection): void;
    protected _readDir(dir: string, patterns: string[]): string[];
    protected _out(...args: any[]): void;
}
