var parseDeps = require('./parse-dependencies');
var indexFiles = require('./index-files');
var packFiles = require('./pack-files');

/**
 * @param {object} options
 * @param {Array<object>} options.files
 * @param {boolean} options.sourceMap
 * @returns {Promise}
 */
function requireify(options) {

    var allFiles = getFileSet(options.files);

    var deps = parseDeps(allFiles);
    var indices = indexFiles(allFiles);

    return packFiles({
        allFiles: allFiles,
        deps: deps,
        indices: indices,
        sourceMap: options.sourceMap
    });

}

function getFileSet(files) {

    var fileSet = {};

    files.forEach(function(file) {

        fileSet[file.originalPath] = file;

    });

    return fileSet;

}

module.exports = requireify;