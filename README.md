This is a fork of a great library by Biesbjerg.
(But the original Beisbjerg's library is unfortunately no longer being developed)

This library adds compatibility for **Angular 13** and **Angular 14**...

# ngx-translate-extract

> Angular translations extractor (plugin for [@ngx-translate](https://github.com/ngx-translate/core))

> ✓ _Angular 14, Ivy and Angular Universal (SSR) compatible_

Extract translatable (ngx-translate) strings and save as a JSON or Gettext pot file.
Merges with existing strings if the output file already exists.

## Install

Install the package in your project:

```bash
npm install @bartholomej/ngx-translate-extract --save-dev
# yarn add @bartholomej/ngx-translate-extract --dev
```

Choose the version corresponding to your Angular version:

| Angular    | ngx-translate-extract                                                                      |
| ---------- | ------------------------------------------------------------------------------------------ |
| 14         | 8.x+                                                                                       |
| 13         | 8.x+                                                                                       |
| 8.x – 12.x | [@biesbjerg/ngx-translate-extract](https://github.com/biesbjerg/ngx-translate-extract) 7.x |

Add a script to your project's `package.json`:

```json
...
"scripts": {
  "i18n:init": "ngx-translate-extract --input ./src --output ./src/assets/i18n/template.json --key-as-default-value --replace --format json",
  "i18n:extract": "ngx-translate-extract --input ./src --output ./src/assets/i18n/{en,da,de,fi,nb,nl,sv}.json --clean --format json"
}
...
```

You can now run `npm run i18n:extract` and it will extract strings from your project.

## Usage

**Extract from dir and save to file**

```bash
ngx-translate-extract --input ./src --output ./src/assets/i18n/strings.json
```

**Extract from multiple dirs**

```bash
ngx-translate-extract --input ./src-a ./src-b --output ./src/assets/i18n/strings.json
```

**Extract and save to multiple files using path expansion**

```bash
ngx-translate-extract --input ./src --output ./src/i18n/{da,en}.json
```

### JSON indentation

Tabs are used by default for indentation when saving extracted strings in json formats:

If you want to use spaces instead, you can do the following:

```bash
ngx-translate-extract --input ./src --output ./src/i18n/en.json --format-indentation ' '
```

### Marker function

If you want to extract strings that are not passed directly to `TranslateService`'s `get()`/`instant()`/`stream()` methods, you can wrap them in a marker function to let `ngx-translate-extract` know you want to extract them.

Install marker function:

```bash
npm install @biesbjerg/ngx-translate-extract-marker
```

```ts
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

marker('Extract me');
```

You can alias the marker function if needed:

```ts
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

_('Extract me');
```

_Note: `ngx-translate-extract` will automatically detect the import name_

### Commandline arguments

```
Usage:
ngx-translate-extract [options]

Output
  --format, -f                Format    [string] [choices: "json", "namespaced-json", "pot"] [default: "json"]
  --format-indentation, --fi  Format indentation (JSON/Namedspaced JSON)                [string] [default: "	"]
  --sort, -s                  Sort strings in alphabetical order                                     [boolean]
  --clean, -c                 Remove obsolete strings after merge                                    [boolean]
  --replace, -r               Replace the contents of output file if it exists (Merges by default)   [boolean]

Extracted key value (defaults to empty string)
  --key-as-default-value, -k     Use key as default value                                            [boolean]
  --null-as-default-value, -n    Use null as default value                                           [boolean]
  --string-as-default-value, -d  Use string as default value                                          [string]

Options:
  --version, -v  Show version number                                                                 [boolean]
  --help, -h     Show help                                                                           [boolean]
  --input, -i    Paths you would like to extract strings from. You can use path expansion, glob patterns and
                 multiple paths        [array] [required] [default: ["/Users/kim/apps/ngx-translate-extract"]]
  --output, -o   Paths where you would like to save extracted strings. You can use path expansion, glob
                 patterns and multiple paths                                                [array] [required]

Examples:
  ngx-translate-extract -i ./src-a/ -i ./src-b/ -o strings.json           Extract (ts, html) from multiple paths
  ngx-translate-extract -i './{src-a,src-b}/' -o strings.json             Extract (ts, html) from multiple paths using brace
                                                           expansion
  ngx-translate-extract -i ./src/ -o ./i18n/da.json -o ./i18n/en.json     Extract (ts, html) and save to da.json and en.json
  ngx-translate-extract -i ./src/ -o './i18n/{en,da}.json'                Extract (ts, html) and save to da.json and en.json
                                                           using brace expansion
  ngx-translate-extract -i './src/**/*.{ts,tsx,html}' -o strings.json     Extract from ts, tsx and html
  ngx-translate-extract -i './src/**/!(*.spec).{ts,html}' -o              Extract from ts, html, excluding files with ".spec"
  strings.json
```

## Note for GetText users

Please pay attention of which version of `gettext-parser` you actually use in your project. For instance, `gettext-parser:1.2.2` does not support HTML tags in translation keys.

## Credits

- Original library, idea and code: [@biesbjerg/ngx-translate-extract](https://github.com/biesbjerg/ngx-translate-extract) ❤️
