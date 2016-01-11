var directoryCrawler = require('../directory-crawler');
var path = require('path');
var sass = require('node-sass');
var sourceMap = require('../source-map-utility');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.filePath
 * @param {string} options.bundleDir
 * @param {boolean} options.sourceMap
 * @param {string} options.siteRoot
 * @param {function} options.success
 * @param {function} options.error
 */
function compile(options) {

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
                options.error(err);
            } else {
                options.success(result.css.toString());
            }

        });

    } catch(err) {

        options.error(err);

    }

}

module.exports = compile;