var clean = require('./clean-source-map');
var extract = require('./extract-source-map');
var getComment = require('./get-source-map-comment');

module.exports = {
    clean: clean,
    extract: extract,
    getComment: getComment
};