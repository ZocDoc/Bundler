var convert = require('convert-source-map');
var type = require('../file-type');

function getComment(map, fileType) {

    var encodedMap = convert.fromObject(map).toComment();

    switch (fileType) {

        case type.CSS:
            return '/*# sourceMappingURL=' + encodedMap + ' */';

        case type.JS:
            return '//# sourceMappingURL=' + encodedMap;

    }

}

module.exports = getComment;