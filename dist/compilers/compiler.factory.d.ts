import { CompilerInterface } from '../compilers/compiler.interface';
export declare class CompilerFactory {
    static create(format: string, options?: {}): CompilerInterface;
}
