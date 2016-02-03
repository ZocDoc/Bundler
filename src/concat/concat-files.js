var FileType = require('../file').type;
var Combiner = require('./source-map-combiner');
var requireify = require('./requireify');
var Promise = require('bluebird');

/**
 * @param {object} options
 * @param {Array<object>} options.files
 * @param {string} options.fileType
 * @param {boolean} options.sourceMap
 * @returns {Promise}
 */
function concat(options) {

    return new Promise(function(resolve) {

        var code = [],
            result,
            offset,
            combiner;

        if (options.sourceMap) {
            offset = 0;
            combiner = new Combiner();
        }

        options.files.forEach(function(file) {

            switch (options.fileType) {

                case FileType.CSS:
                    code.push(file.code);
                    code.push('\n');
                    break;

                case FileType.JS:
                    code.push(';');
                    code.push(file.code);
                    code.push('\n');
                    break;

            }

            if (options.sourceMap) {
                combiner.addFile(file.path, file.code, file.map, {
                    line: offset
                });
                offset += newlinesIn(file.code) + 1;
            }

        });

        result = {
            code: code.join('')
        };

        if (options.sourceMap) {
            result.map = combiner.toSourceMap();
        }

        resolve(result);

    });

}

function newlinesIn(code) {

    if (!code){
        return 0;
    }

    var newlines = code.match(/\n/g);

    return newlines ? newlines.length : 0;

}

module.exports = concat;