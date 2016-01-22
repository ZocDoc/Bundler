var less = require('less');
var path = require('path');
var Promise = require('bluebird');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {boolean} options.sourceMap
 * @returns {bluebird}
 */
function compile(options) {

    return new Promise(function(resolve, reject) {

        try {

            var lessDir = path.dirname(options.inputPath),
                lessOptions = {
                    paths: ['.', lessDir], // Specify search paths for @import directives
                    filename: options.inputPath
                };

            if (options.sourceMap) {
                lessOptions.sourceMap = true;
            }

            less.render(options.code, lessOptions, function (err, result) {

                if (err) {
                    reject(err);
                } else {
                    resolve({
                        code: result.css,
                        map: result.map ? JSON.parse(result.map) : undefined
                    });
                }

            });

        } catch (err) {

            reject(err);

        }

    });

}

module.exports = compile;