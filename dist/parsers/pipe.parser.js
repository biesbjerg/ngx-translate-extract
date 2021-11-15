import { parseTemplate, BindingPipe, LiteralPrimitive, Conditional, Binary, LiteralMap, LiteralArray, Interpolation, Call } from '@angular/compiler';
import { TranslationCollection } from '../utils/translation.collection.js';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils.js';
const TRANSLATE_PIPE_NAME = 'translate';
export class PipeParser {
    extract(source, filePath) {
        if (filePath && isPathAngularComponent(filePath)) {
            source = extractComponentInlineTemplate(source);
        }
        let collection = new TranslationCollection();
        const nodes = this.parseTemplate(source, filePath);
        const pipes = nodes.map((node) => this.findPipesInNode(node)).flat();
        pipes.forEach((pipe) => {
            this.parseTranslationKeysFromPipe(pipe).forEach((key) => {
                collection = collection.add(key);
            });
        });
        return collection;
    }
    findPipesInNode(node) {
        let ret = [];
        if (node?.children) {
            ret = node.children.reduce((result, childNode) => {
                const children = this.findPipesInNode(childNode);
                return result.concat(children);
            }, [ret]);
        }
        if (node?.value?.ast) {
            ret.push(...this.getTranslatablesFromAst(node.value.ast));
        }
        if (node?.attributes) {
            const translateableAttributes = node.attributes.filter((attr) => {
                return attr.name === TRANSLATE_PIPE_NAME;
            });
            ret = [...ret, ...translateableAttributes];
        }
        if (node?.inputs) {
            node.inputs.forEach((input) => {
                if (input?.value?.ast) {
                    ret.push(...this.getTranslatablesFromAst(input.value.ast));
                }
            });
        }
        return ret;
    }
    parseTranslationKeysFromPipe(pipeContent) {
        const ret = [];
        if (pipeContent instanceof LiteralPrimitive) {
            ret.push(pipeContent.value);
        }
        else if (pipeContent instanceof Conditional) {
            const trueExp = pipeContent.trueExp;
            ret.push(...this.parseTranslationKeysFromPipe(trueExp));
            const falseExp = pipeContent.falseExp;
            ret.push(...this.parseTranslationKeysFromPipe(falseExp));
        }
        else if (pipeContent instanceof BindingPipe) {
            ret.push(...this.parseTranslationKeysFromPipe(pipeContent.exp));
        }
        return ret;
    }
    getTranslatablesFromAst(ast) {
        if (this.expressionIsOrHasBindingPipe(ast)) {
            return [ast];
        }
        if (ast instanceof Interpolation) {
            return this.getTranslatablesFromAsts(ast.expressions);
        }
        if (ast instanceof Conditional) {
            return this.getTranslatablesFromAsts([ast.trueExp, ast.falseExp]);
        }
        if (ast instanceof Binary) {
            return this.getTranslatablesFromAsts([ast.left, ast.right]);
        }
        if (ast instanceof BindingPipe) {
            return this.getTranslatablesFromAst(ast.exp);
        }
        if (ast instanceof LiteralMap) {
            return this.getTranslatablesFromAsts(ast.values);
        }
        if (ast instanceof LiteralArray) {
            return this.getTranslatablesFromAsts(ast.expressions);
        }
        if (ast instanceof Call) {
            return this.getTranslatablesFromAsts(ast.args);
        }
        return [];
    }
    getTranslatablesFromAsts(asts) {
        return this.flatten(asts.map((ast) => this.getTranslatablesFromAst(ast)));
    }
    flatten(array) {
        return [].concat(...array);
    }
    expressionIsOrHasBindingPipe(exp) {
        if (exp.name && exp.name === TRANSLATE_PIPE_NAME) {
            return true;
        }
        if (exp.exp && exp.exp instanceof BindingPipe) {
            return this.expressionIsOrHasBindingPipe(exp.exp);
        }
        return false;
    }
    parseTemplate(template, path) {
        return parseTemplate(template, path).nodes;
    }
}
//# sourceMappingURL=pipe.parser.js.map