var directoryCrawler = require('../directory-crawler');
var Promise = require('bluebird');
var sass = require('node-sass');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {string} options.outputPath
 * @param {string} options.bundleDir
 * @param {boolean} options.sourceMap
 * @returns {Promise}
 */
function compile(options) {

    return new Promise(function(resolve, reject) {

        var sassOptions = {
            file: options.inputPath,
            data: options.code,
            includePaths: directoryCrawler.crawl(options.bundleDir)
        };

        if (options.sourceMap) {
            sassOptions.sourceMap = true;
            sassOptions.omitSourceMapUrl = true;
            sassOptions.outFile = options.outputPath;
        }

        sass.render(sassOptions, function (err, result) {

            if (err) {
                reject(err);
            } else {
                resolve({
                    code: result.css.toString(),
                    map: result.map ? JSON.parse(result.map.toString()) : undefined
                });
            }

        });

    });

}

module.exports = compile;