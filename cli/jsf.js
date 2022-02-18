#!/usr/bin/env node

const [, , ...args] = process.argv;
const fs = require('fs');
const path = require("path");

const findFilesRecursively = (directory, listOfFile, recursiveFolder = '') => {
    const resolvedPath = path.resolve('cli', directory);
    const dir = fs.readdirSync(resolvedPath);

    dir.forEach((item) => {
        if (fs.lstatSync(item).isDirectory()) {
            return findFilesRecursively(path.join(directory, item), listOfFile, item);
        }

        const fileWithPath = '' !== recursiveFolder
            ? `${recursiveFolder}/${item}`
            : item
        ;

        listOfFile.push(fileWithPath);
    });
};

const // CLI command
    NEW = 'new',
    GENERATE = 'generate'
;

(function cli() {
    if (NEW === args[0]) {
        const boilerplateFiles = [];

        findFilesRecursively('boilerplate', boilerplateFiles);

        boilerplateFiles.forEach((file) => {
            fs.copyFileSync(path.join(__dirname, file), file);
        });
        return;
    } else if (GENERATE === args[0]) {
        console.log('must be implemented');
        return;
    }

    console.warn('please provide a valid argument');
})();