import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';
export declare class NamespacedJsonCompiler implements CompilerInterface {
    compile(collection: TranslationCollection): string;
    parse(contents: string): TranslationCollection;
}
