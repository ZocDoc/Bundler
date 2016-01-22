var convert = require('convert-source-map');
var type = require('../file-type');

function getComment(map, fileType) {

    var encodedMap = 'sourceMappingURL=data:application/json;base64,' + convert.fromObject(map).toBase64();

    switch (fileType) {

        case type.CSS:
            return '/*# ' + encodedMap + ' */';

        case type.JS:
            return '//# ' + encodedMap;

    }

}

module.exports = getComment;