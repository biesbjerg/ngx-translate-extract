If this tool saves you time, please consider making a donation towards the continued maintainence and development: https://donate.biesbjerg.com

[![Donate](images/donate-badge.png)](https://donate.biesbjerg.com)

# Usage

## ngx-translate-extract
Extract translatable (ngx-translate) strings and save as a JSON or Gettext pot file.
Merges with existing strings if the output file already exists.

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
If, for some reason, you want to extract strings not passed directly to `TranslateService`'s `get()` or `instant()` methods, you can wrap them in a marker function to let `ngx-translate-extract` know you want to extract them.

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
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

_('Extract me');
```

`ngx-translate-extract ... -m _`

## Commandline arguments
```
Usage:
ngx-translate-extract [options]

Options:
  --version, -v               Show version number                      [boolean]
  --help, -h                  Show help                                [boolean]
  --input, -i                 Paths you would like to extract strings from. You
                              can use path expansion, glob patterns and multiple
                              paths
                      [array] [default: current working path]
     [array] [required] [default: current working path]
  --patterns, -p               Extract strings from the following file patterns
                                    [array] [default: ["/**/*.html","/**/*.ts"]]
  --output, -o                 Paths where you would like to save extracted
                               strings. You can use path expansion, glob
                               patterns and multiple paths    [array] [required]
  --format, -f                 Output format
          [string] [choices: "json", "namespaced-json", "pot"] [default: "json"]
  --format-indentation, --fi   Output format indentation  [string] [default: "	"]
  --replace, -r                Replace the contents of output file if it exists
                               (Merges by default)                     [boolean]
  --sort, -s                   Sort strings in alphabetical order when saving
                                                                       [boolean]
  --clean, -c                  Remove obsolete strings when merging    [boolean]
  --key-as-default-value, -k   Use key as default value for translations
                                                                       [boolean]
  --null-as-default-value, -n  Use null as default value for translations
                                                                       [boolean]
```
