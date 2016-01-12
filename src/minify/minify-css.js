var CleanCss = require('clean-css');
var path = require('path');
var Promise = require('bluebird');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {object} options.map
 * @param {string} options.inputPath
 * @param {boolean} options.sourceMap
 * @param {boolean} options.siteRoot
 * @returns {bluebird}
 */
function minify(options) {

    return new Promise(function(resolve, reject) {

        try {

            var cleaner = new CleanCss({
                advanced: false,
                restructuring: false,
                sourceMap: options.sourceMap
            });

            var css = {};
            css[getFilePath(options.inputPath, options.map)] = {
                styles: options.code,
                sourceMap: JSON.stringify(options.map)
            };

            cleaner.minify(css, function (err, result) {

                if (err) {
                    reject(err);
                } else {
                    resolve({
                        code: result.styles,
                        map: result.sourceMap ? JSON.parse(result.sourceMap) : undefined
                    });
                }

            });

        } catch (err) {

            reject(err);

        }

    });

}

function getFilePath(inputPath, map) {

    if (map) {
        return path.basename(inputPath);
    } else {
        return inputPath;
    }

}

module.exports = minify;