import { CompilerInterface } from './compiler.interface.js';
import { TranslationCollection } from '../utils/translation.collection.js';
export declare class JsonCompiler implements CompilerInterface {
    indentation: string;
    extension: string;
    constructor(options?: any);
    compile(collection: TranslationCollection): string;
    parse(contents: string): TranslationCollection;
    protected isNamespacedJsonFormat(values: any): boolean;
}
