var less = require('less');
var path = require('path');
var Promise = require('bluebird');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {boolean} options.sourceMap
 * @param {boolean} options.outputBundleStats
 * @param {object} options.bundleStatsCollector
 * @returns {Promise}
 */
function compile(options) {

    return new Promise(function(resolve, reject) {

        var lessDir = path.dirname(options.inputPath),
            lessOptions = {
                paths: ['.', lessDir], // Specify search paths for @import directives
                filename: options.inputPath
            };

        if (options.sourceMap) {
            lessOptions.sourceMap = true;
        }

        if (options.outputBundleStats) {
            options.bundleStatsCollector.SearchForLessImports(options.inputPath, options.code);
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

    });

}

module.exports = compile;