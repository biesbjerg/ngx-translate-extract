#! /usr/bin/env node

//need to be imported once per application: @see  https://github.com/inversify/InversifyJS/issues/262#issuecomment-227593844
let reflectMetadata = require('reflect-metadata');

//IoC configuration: imported here to allow redefintion for usage as library
let inversifyConfig = require('../dist/ioc/inversify.config');

let cli = require('../dist/cli/cli');

cli.getExtractTask().execute();

