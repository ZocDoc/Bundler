var _ = require('underscore');
var browserPack = require('browser-pack');
var concat = require('concat-stream');
var FileType = require('../../file').type;
var Promise = require('bluebird');
var sourceMap = require('../../file/source-map');
var toStream = require('string-to-stream');

/**
 * @param {object} options
 * @param {object} options.allFiles
 * @param {object} options.deps
 * @param {object} options.indices
 * @param {boolean} options.sourceMap
 * @returns {Promise}
 */
function pack(options) {

    return new Promise(function(resolve, reject) {

        var packInput = getPackInput(options);

        toStream(JSON.stringify(packInput)).pipe(browserPack({
                hasExports: true
            }))
            .pipe(concat(function(stream) {

                var result = sourceMap.extract(stream.toString());

                if (options.sourceMap) {
                    resolve(result);
                } else {
                    resolve({
                        code: result.code
                    });
                }

            }))
            .on('error', function(err) {
                reject(err);
            });

    });

}

function getPackInput(options) {

    var packInput = [];

    _.each(options.allFiles, function(file, filePath) {

        var fileDeps = {},
            code;

        _.each(options.deps[filePath], function(dep, reference) {
            if (dep.isPath) {
                fileDeps[reference] = options.indices[dep.name];
            } else {
                fileDeps[reference] = reference;
            }
        });

        if (options.sourceMap && file.map) {
            code = file.code + '\n' + sourceMap.getComment(file.map, FileType.JS);
        } else {
            code = file.code;
        }

        packInput.push({
            sourceFile: filePath,
            id: options.indices[filePath],
            source: code,
            deps: fileDeps
        });

    });

    return packInput;

}

module.exports = pack;