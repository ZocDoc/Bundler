var clean = require('./clean-source-map');
var getComment = require('./get-source-map-comment');
var stripComment = require('./strip-source-map-comment');

module.exports = {
    clean: clean,
    getComment: getComment,
    stripComment: stripComment
};