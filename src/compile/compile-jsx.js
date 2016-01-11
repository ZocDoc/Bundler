var Promise = require('bluebird');
var react = require('react-tools');
var sourceMap = require('../source-map-utility');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.filePath
 * @param {boolean} options.sourceMap
 * @param {string} options.siteRoot
 * @returns {bluebird}
 */
function compile(options) {

    return new Promise(function(resolve, reject) {

        try {

            var reactOptions = {};

            if (options.sourceMap) {
                reactOptions.sourceMap = true;
                reactOptions.sourceFilename = sourceMap.getSourceFilePath(options.filePath, options.siteRoot);
            }

            var compiledJsx = react.transform(options.code, reactOptions);

            resolve(compiledJsx);

        } catch (err) {

            reject(err);

        }

    });

}

module.exports = compile;