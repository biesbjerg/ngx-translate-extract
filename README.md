# Usage

## ngx-translate-extract
Extract translatable (ngx-translate) strings and save as a JSON or Gettext pot file.
Merges with existing strings if the output file already exists.

It's the fork of [@biesbjerg/ngx-translate-extract](https://github.com/biesbjerg/ngx-translate-extract).
In this version added string **context** and **message** support feature.

### Usage
Install the package in your project:

`npm install @biesbjerg/ngx-translate-extract --save-dev`

Add a script to your project's `package.json`:
```json
...
"scripts": {
  "extract-i18n": "ngx-translate-extract --input ./src --output ./src/assets/i18n/ --clean --sort --format namespaced-json"
}
...
```
You can now run `npm run extract-i18n` and it will extract strings from your project.

### Examples

**Extract from dir and save to file**

`ngx-translate-extract --input ./src --output ./src/assets/i18n/template.json`

**Extract from multiple dirs**

`ngx-translate-extract --input ./src-a ./src-b --output ./src/assets/i18n/template.json`


**Extract and save to multiple files using path expansion**

_Note: This method does not work on Windows!_

`ngx-translate-extract --input ./src --output ./src/i18n/{da,en}.json`

On Windows you must specify each output destination individually:

`ngx-translate-extract --input ./src --output ./src/i18n/da.json ./src/i18n/en.json`

### JSON indentation
Tabs are used by default for indentation when saving extracted strings in json formats:

If you want to use spaces instead, you can do the following:

`ngx-translate-extract --input ./src --output ./src/i18n/en.json --format-indentation '  '`

## Mark strings for extraction using a marker function
If, for some reason, you want to extract strings not passed directly to `TranslateService`'s `get()` or `instant()` methods, you can wrap them in a custom marker function to let `ngx-translate-extract` know you want to extract them.

Install marker function:
`npm install @biesbjerg/ngx-translate-extract-marker`

```ts
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

marker('Extract me');
```

Add the `marker` argument when running the extract script:

`ngx-translate-extract ... -m extract`

You can alias the marker function if needed:

```ts
import { marker as $ } from '@biesbjerg/ngx-translate-extract-marker';

$('Extract me');

//Extract string with specific content and comment to translator
$('Extract me', 'context', 'comment');

```

`ngx-translate-extract ... -m _`

## Context and comment support
Sometimes you need to add a context for string.
For example if you have absolutely the same string with different meaning.
The real example is Georgia as country and Georgia as US state.
To solve this problem was added two directives, additional pipe parameters and marker function parameters.

#### Specify context and comment using directives
Use `translate-context` directive to define translate context (Optional).\
Use `translate-comment` directive to define translate comment (Optional).
```html
<div translate-context="US State" translate-comment="Please, translate it as US STATE." translate>
  Georgia  
</div>

<div translate-context="Country" translate-comment="Please, translate it as COUNTRY." translate>
    Georgia
</div>

```

#### Specify context and comment using translate pipe parameters
Set second `translate` pipe parameter to define context.\
Set third `translate` pipe parameter to define comment.

```html
<div>
  {{Georgia | translate:null:'US State':'Please, translate it as US STATE.'}}  
</div>

<div>
  {{Georgia | translate:null:'Country':'Please, translate it as COUNTRY.'}} 
</div>

//If you need just define comment set context to empty string ''
<div>
  {{Once upon a time there was a tiny kingdom. | translate:null:'':'Translator, this comment for you!'}} 
</div>

```

### Specify context and comment using marker function
```ts
    import { marker as $ } from '@biesbjerg/ngx-translate-extract-marker';
    
    $('Extract me');
    
    //Extract string with specific content and comment to translator
    $('Extract me', 'context', 'comment');
```

## Commandline arguments
```shell
Usage:
ngx-translate-extract [options]

Options:
  --version, -v               Show version number                      [boolean]
  --help, -h                  Show help                                [boolean]
  --input, -i                 Paths you would like to extract strings from. You
                              can use path expansion, glob patterns and multiple
                              paths
                      [array] [default: current working path]
  --patterns, -p              Extract strings from the following file patterns
                                    [array] [default: ["/**/*.html","/**/*.ts"]]
  --output, -o                Paths where you would like to save extracted
                              strings. You can use path expansion, glob patterns
                              and multiple paths              [array] [required]
  --marker, -m                Extract strings passed to a marker function
                                                       [string] [default: false]
  --format, -f                Output format
          [string] [choices: "json", "namespaced-json ( not supported in this version )", "pot"] [default: "json"]
  --format-indentation, --fi  Output format indentation   [string] [default: "	"]
  --replace, -r               Replace the contents of output file if it exists
                              (Merges by default)     [boolean] [default: false]
  --sort, -s                  Sort strings in alphabetical order when saving
                                                      [boolean] [default: false]
  --clean, -c                 Remove obsolete strings when merging
                                                      [boolean] [default: false]
  --key-as-default-value, -k  Use key as default value for translations
                                                      [boolean] [default: false]

```

