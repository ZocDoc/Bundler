var clean = require('./clean-source-map');
var extract = require('./extract-source-map');
var getComment = require('./get-source-map-comment');
var getSourceFilePath = require('./get-source-file-path');

module.exports = {
    clean: clean,
    extract: extract,
    getComment: getComment,
    getSourceFilePath: getSourceFilePath
};