import { parseTemplate, TmplAstElement as Element, TmplAstText as Text, TmplAstTemplate as Template, ASTWithSource, LiteralPrimitive, Conditional, Binary, BindingPipe, Interpolation, LiteralArray, LiteralMap } from '@angular/compiler';
import { TranslationCollection } from '../utils/translation.collection.js';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils.js';
const TRANSLATE_ATTR_NAME = 'translate';
export class DirectiveParser {
    extract(source, filePath) {
        let collection = new TranslationCollection();
        if (filePath && isPathAngularComponent(filePath)) {
            source = extractComponentInlineTemplate(source);
        }
        const nodes = this.parseTemplate(source, filePath);
        const elements = this.getElementsWithTranslateAttribute(nodes);
        elements.forEach((element) => {
            const attribute = this.getAttribute(element, TRANSLATE_ATTR_NAME);
            if (attribute?.value) {
                collection = collection.add(attribute.value);
                return;
            }
            const boundAttribute = this.getBoundAttribute(element, TRANSLATE_ATTR_NAME);
            if (boundAttribute?.value) {
                this.getLiteralPrimitives(boundAttribute.value).forEach((literalPrimitive) => {
                    collection = collection.add(literalPrimitive.value);
                });
                return;
            }
            const textNodes = this.getTextNodes(element);
            textNodes.forEach((textNode) => {
                collection = collection.add(textNode.value.trim());
            });
        });
        return collection;
    }
    getElementsWithTranslateAttribute(nodes) {
        let elements = [];
        nodes.filter(this.isElementLike).forEach((element) => {
            if (this.hasAttribute(element, TRANSLATE_ATTR_NAME)) {
                elements = [...elements, element];
            }
            if (this.hasBoundAttribute(element, TRANSLATE_ATTR_NAME)) {
                elements = [...elements, element];
            }
            const childElements = this.getElementsWithTranslateAttribute(element.children);
            if (childElements.length) {
                elements = [...elements, ...childElements];
            }
        });
        return elements;
    }
    getTextNodes(element) {
        return element.children.filter(this.isText);
    }
    hasAttribute(element, name) {
        return this.getAttribute(element, name) !== undefined;
    }
    getAttribute(element, name) {
        return element.attributes.find((attribute) => attribute.name === name);
    }
    hasBoundAttribute(element, name) {
        return this.getBoundAttribute(element, name) !== undefined;
    }
    getBoundAttribute(element, name) {
        return element.inputs.find((input) => input.name === name);
    }
    getLiteralPrimitives(exp) {
        if (exp instanceof LiteralPrimitive) {
            return [exp];
        }
        let visit = [];
        if (exp instanceof Interpolation) {
            visit = exp.expressions;
        }
        else if (exp instanceof LiteralArray) {
            visit = exp.expressions;
        }
        else if (exp instanceof LiteralMap) {
            visit = exp.values;
        }
        else if (exp instanceof BindingPipe) {
            visit = [exp.exp];
        }
        else if (exp instanceof Conditional) {
            visit = [exp.trueExp, exp.falseExp];
        }
        else if (exp instanceof Binary) {
            visit = [exp.left, exp.right];
        }
        else if (exp instanceof ASTWithSource) {
            visit = [exp.ast];
        }
        let results = [];
        visit.forEach((child) => {
            results = [...results, ...this.getLiteralPrimitives(child)];
        });
        return results;
    }
    isElementLike(node) {
        return node instanceof Element || node instanceof Template;
    }
    isText(node) {
        return node instanceof Text;
    }
    parseTemplate(template, path) {
        return parseTemplate(template, path).nodes;
    }
}
//# sourceMappingURL=directive.parser.js.map