var babel = require('babel-core');
var path = require('path');
var Promise = require('bluebird');

/**
 * @param {string[]} presets
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {string} options.nodeModulesPath
 * @param {boolean} options.sourceMap
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
                babelOptions.sourceMaps = true;
                babelOptions.sourceFileName = options.inputPath;
            }

            var result = babel.transform(options.code, babelOptions);

            resolve({
                code: result.code,
                map: result.map
            });

        } catch (err) {

            reject(err);

        }

    });

}

module.exports = {
    transform: transform
};