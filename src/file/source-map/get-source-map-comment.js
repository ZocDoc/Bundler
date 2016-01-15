var convert = require('convert-source-map');
var type = require('../file-type');

function getComment(map, fileType) {

    var mapConverter = convert.fromObject(map);

    switch (fileType) {

        case type.CSS:
            return mapConverter.toComment({
                multiline: true
            });

        case type.JS:
            return mapConverter.toComment();

    }

}

module.exports = getComment;