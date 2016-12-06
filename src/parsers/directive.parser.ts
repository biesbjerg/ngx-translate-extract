import {ParserInterface} from './parser.interface';
import * as $ from 'cheerio';

export class DirectiveParser implements ParserInterface {

    public patterns = {
        template: `template:\\s?(("|'|\`)(.|[\\r\\n])+?[^\\\\]\\2)`
    };

    protected _parseTemplate(content) {
        let results: string[] = [],
            template = content.trim()
            // hack for cheerio that doesn't support wrapped attributes
                .replace('[translate]=', '__translate__=');

        $(template).find('[translate],[__translate__]').contents().filter(function() {
            return this.nodeType === 3; // node type 3 = text node
        }).each(function() {
            let key,
                $this = $(this),
                element = $(this).parent(),
                wrappedAttr = element.attr('__translate__'), // previously [translate]=
                attr = element.attr('translate'); // translate=

            // only support string values for now
            if(wrappedAttr && wrappedAttr.match(/^['"].*['"]$/)) {
                key = wrappedAttr.substr(1, wrappedAttr.length - 2);
            } else if(attr) {
                key = attr;
            }

            if(!key) {
                key = $this.text().replace(/\\n/gi, '').trim();
            }

            if(key) {
                results.push(key);
            }
        });

        return results;
    }

    public process(contents: string): string[] {
        const regExp = new RegExp(this.patterns.template, 'gi');

        let results: string[] = [],
            hasTemplate = false,
            matches;

        while(matches = regExp.exec(contents)) {
            let content = matches[1]
                .substr(1, matches[1].length - 2);

            hasTemplate = true;
            results = results.concat(this._parseTemplate(content));
        }

        if(!hasTemplate) {
            this._parseTemplate(contents);
        }

        return results;
    }

}
