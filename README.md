If you like this project please show your support with a GitHub star. Much appreciated!

# ngx-translate-extract
Extract translatable (ngx-translate) strings and save as a JSON or Gettext pot file.
Merges with existing strings if the output file already exists.

## Usage
Install the package in your project:

`npm install @biesbjerg/ngx-translate-extract --save-dev`

Add an `extract` script to your project's `package.json`:
```
"scripts": {
  "extract": "ngx-translate-extract --input ./src --output ./src/assets/i18n/ --clean --sort --format namespaced-json"
}
```
You can now run `npm run extract` to extract strings.

## Extract examples

**Extract from dir and save to file**

`ngx-translate-extract -i ./src -o ./src/i18n/strings.json`

**Extract from multiple dirs**

`ngx-translate-extract -i ./src/folder-a ./src/folder-b -o ./src/i18n/strings.json`

**Extract and save to multiple files**

`ngx-translate-extract -i ./src -o ./src/i18n/{da,en,fr}.json`

**or**

`ngx-translate-extract -i ./src -o ./src/i18n/da.json ./src/i18n/en.json ./src/i18n/fr.json`

**or (update only)**

`ngx-translate-extract -i ./src -o ./src/i18n/*.json`

**or (update only)**

## Custom indentation
By default, tabs are used for indentation when writing extracted strings to json formats:

`ngx-translate-extract -i ./src -o ./src/i18n/en.json --format-indentation $'\t'`

If you want to use spaces instead, you can do the following:

`ngx-translate-extract -i ./src -o ./src/i18n/en.json --format-indentation '  '`

## Mark strings for extraction using a marker function
If, for some reason, you want to extract strings not passed directly to TranslateService, you can wrap them in a custom marker function.

```ts
import { _ } from '@biesbjerg/ngx-translate-extract';

_('Extract me');
```

Add the `marker` argument when running the extract script:

`ngx-translate-extract ... -m _`

Modify the scripts arguments as required.

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
  --patterns, -p              Extract strings from the following file patterns
                                    [array] [default: ["/**/*.html","/**/*.ts"]]
  --output, -o                Paths where you would like to save extracted
                              strings. You can use path expansion, glob patterns
                              and multiple paths              [array] [required]
  --marker, -m                Extract strings passed to a marker function
                                                       [string] [default: false]
  --format, -f                Output format
          [string] [choices: "json", "namespaced-json", "pot"] [default: "json"]
  --format-indentation, --fi  Output format indentation [string] [default: "\t"]
  --replace, -r               Replace the contents of output file if it exists
                              (Merges by default)     [boolean] [default: false]
  --sort, -s                  Sort strings in alphabetical order when saving
                                                      [boolean] [default: false]
  --clean, -c                 Remove obsolete strings when merging
                                                      [boolean] [default: false]
  --verbose, -vb              If true, prints all processed file paths to console
                                                      [boolean] [default: true]

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/biesbjerg/ngx-translate-extract/graphs/contributors"><img src="https://opencollective.com/ngx-translate-extract/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/ngx-translate-extract/contribute)]

#### Individuals

<a href="https://opencollective.com/ngx-translate-extract"><img src="https://opencollective.com/ngx-translate-extract/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/ngx-translate-extract/contribute)]

<a href="https://opencollective.com/ngx-translate-extract/organization/0/website"><img src="https://opencollective.com/ngx-translate-extract/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/ngx-translate-extract/organization/1/website"><img src="https://opencollective.com/ngx-translate-extract/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/ngx-translate-extract/organization/2/website"><img src="https://opencollective.com/ngx-translate-extract/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/ngx-translate-extract/organization/3/website"><img src="https://opencollective.com/ngx-translate-extract/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/ngx-translate-extract/organization/4/website"><img src="https://opencollective.com/ngx-translate-extract/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/ngx-translate-extract/organization/5/website"><img src="https://opencollective.com/ngx-translate-extract/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/ngx-translate-extract/organization/6/website"><img src="https://opencollective.com/ngx-translate-extract/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/ngx-translate-extract/organization/7/website"><img src="https://opencollective.com/ngx-translate-extract/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/ngx-translate-extract/organization/8/website"><img src="https://opencollective.com/ngx-translate-extract/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/ngx-translate-extract/organization/9/website"><img src="https://opencollective.com/ngx-translate-extract/organization/9/avatar.svg"></a>
