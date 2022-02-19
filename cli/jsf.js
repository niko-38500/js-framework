#!/usr/bin/env node

const [, , ...args] = process.argv;
const fs = require('fs');
const path = require("path");

const // utils closures
    findFilesRecursively = (currentPath, listOfFile) => {
        const
            resolvedPath = path.resolve(__dirname, currentPath),
            dir = fs.readdirSync(resolvedPath)
        ;

        dir.forEach((item) => {
            const
                newPath = path.join(currentPath, item),
                isDirectory = fs.statSync(path.join(__dirname, newPath)).isDirectory()
            ;

            if (isDirectory) {
                return findFilesRecursively(newPath, listOfFile);
            }

            listOfFile.push(newPath);
        });
    },

    deploy = (boilerplateFiles) => {
        console.warn('\x1b[36m', 'Generate files');

        boilerplateFiles.forEach((file) => {
            const
                projectPath = path.resolve('./'),
                t = file.split('/').slice(1).join('/'),
                currentFile = path.resolve(__dirname, file)
            ;

            if (file.split('/')) {
                console.log('splittttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt');
            }

            console.log(t);

            // fs.copyFileSync(currentFile, path.join(projectPath, t));

            console.log('\x1b[32m', `${file} successfully created ...`, '\u2713', '\x1b[0m');
        });

        console.log(`your project ${args[1]} is successfully created`);
    }
;

const // CLI available command
    NEW = 'new',
    GENERATE = 'generate',
    INIT = 'init'
;

(function cli() {
    if (NEW === args[0]) {
        if (!args[1]) {
            console.error('please provide a project name "example: <jsf new my_new_app>"');
            return;
        }
        const PROJECT_NAME = args[1];
        const boilerplateFiles = [];

        findFilesRecursively('boilerplate/', boilerplateFiles);
        deploy(boilerplateFiles);

        return;
    } else if (GENERATE === args[0]) {
        console.log('must be implemented');
        return;
    } else if (INIT === args[0]) {

    }

    console.warn('please provide a valid argument');
})();