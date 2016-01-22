var convert = require('convert-source-map');

var sourceMapRegex = /\n\/(\*|\/)# sourceMappingURL=(.*)$/;

function extract(code) {

    var sourceMap = code.match(sourceMapRegex);

    if (sourceMap) {

        return {
            code: code.replace(sourceMapRegex, ''),
            map: convert.fromComment(sourceMap[0]).toObject()
        };

    } else {

        return {
            code: code
        };

    }

}

module.exports = extract;