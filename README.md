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

`ng2-translate-extract --dir /extract/from/this/dir --output /save/to/this/dir --format json --clean`
## Commandline arguments
```
Usage:
  ng2-translate-extract [OPTIONS] [ARGS]

Options:
  -d, --dir [DIR]        Directory path you would like to extract strings from  (Default is current directory)
  -o, --output [DIR]     Directory path you would like to save extracted
                         strings  (Default is current directory)
  -f, --format [VALUE]   Output format. VALUE must be either [json|pot]  (Default is json)
  -r, --replace BOOLEAN  Replace the contents of output file if it exists
                         (merging by default)
  -c, --clean BOOLEAN    Remove unused keys when merging
  -h, --help             Display help and usage details
```
