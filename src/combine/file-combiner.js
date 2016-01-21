var file = require('../file');
var path = require('path');

function FileCombiner(fileType) {

    this.type = fileType;
    this.files = [];

}

FileCombiner.prototype.add = function add(index, file) {

    this.files[index] = file;

};

/**
 * @param {Object} [options]
 * @param {Boolean} [options.require]
 */
FileCombiner.prototype.combine = function combine(options) {

    var allCode = [],
        files;

    options = options || [];

    if (options.require && this.type === file.type.JS) {

        files = order(this.files);

    } else {

        files = this.files;

    }

    switch (this.type) {

        case file.type.CSS:

            files.forEach(function(file) {
                allCode.push(file.code);
                allCode.push('\n');
            });

            break;

        case file.type.JS:

            files.forEach(function(file) {
                allCode.push(';');
                allCode.push(file.code);
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