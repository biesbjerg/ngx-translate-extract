import { CompilerInterface } from '../compilers/compiler.interface.js';
export declare class CompilerFactory {
    static create(format: string, options?: {}): CompilerInterface;
}
