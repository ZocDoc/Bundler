var _ = require('underscore');
var path = require('path');
var precinct = require('precinct');

/**
 * @param {Array<object>} files
 */
function parse(files) {

    var allFiles = getFileSet(files);

    var rawDeps = getRawDependencies(allFiles);

    return resolveDependencies(allFiles, rawDeps);

}

function getFileSet(files) {

    var fileSet = {};

    files.forEach(function(file) {

        fileSet[file.originalPath] = file;

    });

    return fileSet;

}

function getRawDependencies(allFiles) {

    var rawDeps = {};

    _.each(allFiles, function(file, filePath) {

        rawDeps[filePath] = precinct(file.code);

    });

    return rawDeps;

}

function resolveDependencies(allFiles, rawDeps) {

    var resolvedFiles = {};

    _.each(rawDeps, function(deps, filePath) {

        resolvedFiles[filePath] = _.extend({}, allFiles[filePath], {
            deps: {}
        });

        deps.forEach(function(dep) {
            resolvedFiles[filePath].deps[dep] = resolveDependency(allFiles, filePath, dep);
        });

    });

    return resolvedFiles;

}

function resolveDependency(allFiles, filePath, dep) {

    var baseDir = path.dirname(filePath),
        depPath = path.normalize(path.join(baseDir, dep)),
        tryPath;

    if (dep.indexOf('./') !== 0 && dep.indexOf('../') !== 0) {
        return {
            name: dep,
            isPath: false
        };
    }

    tryPath = depPath;
    if (allFiles[tryPath]) {
        return {
            name: tryPath,
            isPath: true
        };
    }

    tryPath = depPath + '.js';
    if (allFiles[tryPath]) {
        return {
            name: tryPath,
            isPath: true
        };
    }

    tryPath = depPath + '.es6';
    if (allFiles[tryPath]) {
        return {
            name: tryPath,
            isPath: true
        };
    }

    tryPath = path.join(depPath, 'index.js');
    if (allFiles[tryPath]) {
        return {
            name: tryPath,
            isPath: true
        };
    }

    tryPath = path.join(depPath, 'index.es6');
    if (allFiles[tryPath]) {
        return {
            name: tryPath,
            isPath: true
        };
    }

    throw new Error('Could not reoslve dependency ' + dep + ' of ' + filePath);

}

module.exports = parse;