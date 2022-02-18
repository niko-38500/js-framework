#!/usr/bin/env node

const [, , ...args] = process.argv;
const fs = require('fs');
const path = require("path");

const // CLI command
    NEW = 'new',
    GENERATE = 'generate'
;

const BOILERPLATE_FILES = [];

const findFilesRecursively = (directory, recursiveFolder = '') => {
    const resolvedPath = path.resolve('cli', directory);
    const dir = fs.readdirSync(resolvedPath);

    dir.forEach((item) => {
        if (fs.lstatSync(item).isDirectory()) {
            return fillBoilerplate(path.join(directory, item), item);
        }

        BOILERPLATE_FILES.push(`${recursiveFolder}/${item}`);
    });
};

findFilesRecursively('boilerplate');
console.log(BOILERPLATE_FILES);

(function cli() {
    console.log('mlsdfk');
})();