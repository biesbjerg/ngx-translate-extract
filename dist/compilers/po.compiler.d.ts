import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';
export declare class PoCompiler implements CompilerInterface {
    domain: string;
    compile(collection: TranslationCollection): string;
    parse(contents: string): TranslationCollection;
}
