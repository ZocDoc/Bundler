var babel = require('babel-core');
var path = require('path');
var Promise = require('bluebird');
var sourceMap = require('../source-map-utility');

/**
 * @param {string[]} presets
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {string} options.nodeModulesPath
 * @param {boolean} options.sourceMap
 * @param {string} options.siteRoot
 * @returns {bluebird}
 */
function transform(presets, options) {

    return new Promise(function(resolve, reject) {

        try {
            var babelOptions = {
                presets: presets.map(function (preset) {
                    return path.join(options.nodeModulesPath, preset);
                })
            };

            if (options.sourceMap) {
                babelOptions.sourceMaps = 'inline';
                babelOptions.sourceFileName = sourceMap.getSourceFilePath(options.inputPath, options.siteRoot);
            }

            var result = babel.transform(options.code, babelOptions);

            resolve(result.code);

        } catch (err) {

            reject(err);

        }

    });

}

module.exports = {
    transform: transform
};