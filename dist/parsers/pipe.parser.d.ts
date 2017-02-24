import { ParserInterface } from './parser.interface';
import { AbstractTemplateParser } from './abstract-template.parser';
import { TranslationCollection } from '../utils/translation.collection';
export declare class PipeParser extends AbstractTemplateParser implements ParserInterface {
    extract(contents: string, path?: string): TranslationCollection;
    protected _parseTemplate(template: string): TranslationCollection;
}
