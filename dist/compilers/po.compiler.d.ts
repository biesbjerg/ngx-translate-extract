import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';
export declare class PoCompiler implements CompilerInterface {
    extension: string;
    domain: string;
    constructor(options?: any);
    compile(collection: TranslationCollection): string;
    parse(contents: string): TranslationCollection;
}
