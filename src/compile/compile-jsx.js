var compileAsync = require('../compile-async');
var Promise = require('bluebird');
var react = require('react-tools');
var sourceMap = require('../source-map-utility');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
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
                reactOptions.sourceFilename = sourceMap.getSourceFilePath(options.inputPath, options.siteRoot);
            }

            var compiledJsx = react.transform(options.code, reactOptions);

            resolve(compiledJsx);

        } catch (err) {

            reject(err);

        }

    });

}

module.exports = compileAsync(compile);