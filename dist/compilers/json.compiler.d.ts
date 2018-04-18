import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';
export declare class JsonCompiler implements CompilerInterface {
    indentation: string;
    extension: string;
    constructor(options?: any);
    compile(collection: TranslationCollection): string;
    parse(contents: string): TranslationCollection;
    protected _isNamespacedJsonFormat(values: any): boolean;
}
