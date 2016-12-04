# ng2-translate-extract
Extract strings from projects using ng2-translate to json or pot files.

**THIS IS STILL VERY MUCH A WORK IN PROGRESS**

## Usage
If you only need to extract strings from one project, you can install the package locally:

`npm install @biesbjerg/ng2-translate-extract --save-dev`

Add the following `extract` script your project's `package.json`:
```
"scripts": {
  "extract": "ng2-translate-extract --dir ./src --output ./ --format=json"
}
```
You can now run `npm run extract` to extract strings from your project's `src` dir. The extracted strings are saved in `JSON`-format in your project's root.

Modify the scripts arguments as required.

## Global install
You can also install the package globally:

`npm install @biesbjerg/ng2-translate-extract -g`

Now you can execute the script from everywhere:

`ng2-translate-extract --dir /extract/from/this/dir --output /save/to/this/dir --format pot`
## Commandline arguments
```
Usage:
  ng2-translate-extract [OPTIONS] [ARGS]

Options:
  -d, --dir [DIR]        Directory path you would like to extract strings from  (Default is /Users/kim/ionic/ng2-translate-extract/bin)
  -o, --output [DIR]     Directory path you would like to save extracted
                         strings  (Default is /Users/kim/ionic/ng2-translate-extract/bin)
  -f, --format [VALUE]   Output format. VALUE must be either [json|pot]  (Default is json)
  -h, --help             Display help and usage details
```
