var file = require('../file');
var dependencies = require('../dependencies');
var path = require('path');

var CodeType = {
    COMPILED: 'compiled',
    MINIFIED: 'minified'
};

function FileCombiner(fileType) {

    this.type = fileType;

    this.orderedFiles = [];
    this.filesByPath = {};

}

FileCombiner.prototype.add = function add(index, path, compiled, minified) {

    var file = {
        path: path,
        compiled: compiled,
        minified: minified
    };

    this.orderedFiles[index] = file;
    this.filesByPath[path] = file;

};

/**
 * @param {Object} [options]
 * @param {Boolean} [options.require]
 */
FileCombiner.prototype.prepare = function prepare(options) {

    options = options || [];

    if (options.require && this.type === file.type.JS) {

        this.orderedFiles = order(this.orderedFiles);

    }

};

FileCombiner.prototype.combine = function combine() {

    return this._combineFiles(CodeType.COMPILED);

};

FileCombiner.prototype.combineMin = function combineMin() {

    return this._combineFiles(CodeType.MINIFIED);

};

FileCombiner.prototype._combineFiles = function _combineFiles(codeType) {

    var allCode = [];

    switch (this.type) {

        case file.type.CSS:

            this.orderedFiles.forEach(function(file) {
                allCode.push(file[codeType].code);
                allCode.push('\n');
            });

            break;

        case file.type.JS:

            this.orderedFiles.forEach(function(file) {
                allCode.push(';');
                allCode.push(file[codeType].code);
                allCode.push('\n');
            });

            break;

    }

    return allCode.join('');

};

function order(files) {

    var added = {},
        orderedFiles = [],
        filesByPath = {};

    files.forEach(function(file) {

        filesByPath[file.path] = file;

    });

    files.forEach(function(file) {

        addFile(file, added, orderedFiles, filesByPath);

    });

    return orderedFiles;

}

function addFile(file, added, orderedFiles, filesByPath) {

    if (added[file.path]) {
        return;
    }

    if (file.deps && file.deps.length) {

        file.deps.forEach(function(dep) {

            if (dep.match(/(\\|\/)/)) {
                dep = path.normalize(path.join(path.dirname(file.path), dep));
            }

            if (filesByPath[dep]) {
                addFile(filesByPath[dep], added, orderedFiles, filesByPath);
            }
        });

    }

    added[file.path] = true;
    orderedFiles.push(file);

}

module.exports = FileCombiner;