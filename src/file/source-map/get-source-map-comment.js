var convert = require('convert-source-map');
var type = require('../file-type');

function getComment(relativeSourceMapPath, fileType) {

    var sourceMapUrl = 'sourceMappingURL=' + relativeSourceMapPath;

    switch (fileType) {

        case type.CSS:
            return '/*# ' + sourceMapUrl + ' */';

        case type.JS:
            return '//# ' + sourceMapUrl;

    }

}

module.exports = getComment;