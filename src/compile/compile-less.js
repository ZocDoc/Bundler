var less = require('less');
var path = require('path');
var sourceMap = require('../source-map-utility');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.filePath
 * @param {boolean} options.sourceMap
 * @param {string} options.siteRoot
 * @param {boolean} options.outputBundleStats
 * @param {object} options.bundleStatsCollector
 * @param {function} options.success
 * @param {function} options.error
 */
function compile(options) {

    var lessDir = path.dirname(options.filePath),
        fileName = path.basename(options.filePath),
        lessOptions = {
            paths: ['.', lessDir], // Specify search paths for @import directives
            filename: fileName
        };

    if (options.sourceMap) {
        lessOptions.sourceMap = {
            sourceMapFileInline: true,
            sourceMapRootpath: sourceMap.getSourceMapRoot(options.filePath, options.siteRoot)
        };
    }

    if (options.outputBundleStats) {
        options.bundleStatsCollector.SearchForLessImports(options.filePath, options.code);
    }

    less.render(options.code, lessOptions, function (err, result) {

        if (err) {
            options.error(err);
        } else {
            options.success(result.css);
        }

    });

}

module.exports = compile;