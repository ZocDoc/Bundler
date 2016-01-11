var directoryCrawler = require('../directory-crawler');
var path = require('path');
var Promise = require('bluebird');
var sass = require('node-sass');
var sourceMap = require('../source-map-utility');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.filePath
 * @param {string} options.bundleDir
 * @param {boolean} options.sourceMap
 * @param {string} options.siteRoot
 * @returns {bluebird}
 */
function compile(options) {

    return new Promise(function(resolve, reject) {

        try {

            var sassOptions = {
                file: path.basename(options.filePath),
                data: options.code,
                includePaths: directoryCrawler.crawl(options.bundleDir)
            };

            if (options.sourceMap) {
                sassOptions.sourceMapRoot = sourceMap.getSourceMapRoot(options.filePath, options.siteRoot);
                sassOptions.sourceMapEmbed = true;
            }

            sass.render(sassOptions, function (err, result) {

                if (err) {
                    reject(err);
                } else {
                    resolve(result.css.toString());
                }

            });

        } catch (err) {

            reject(err);

        }

    });

}

module.exports = compile;