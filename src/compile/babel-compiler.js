var babel = require('babel-core');
var path = require('path');
var Promise = require('bluebird');

/**
 * @param {object} babelOptions
 * @param {string[]} [babelOptions.presets]
 * @param {string[]} [babelOptions.plugins]
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {string} options.nodeModulesPath
 * @param {boolean} options.sourceMap
 * @returns {bluebird}
 */
function transform(babelOptions, options) {

    return new Promise(function(resolve, reject) {

        try {
            var presets = babelOptions.presets || [];
            var plugins = babelOptions.plugins || [];

            var settings = {
                presets: presets.map(function (preset) {
                    return path.join(options.nodeModulesPath, preset);
                }),
                plugins: plugins.map(function (plugin) {
                    return path.join(options.nodeModulesPath, plugin);
                })
            };

            if (options.sourceMap) {
                settings.sourceMaps = true;
                settings.sourceFileName = options.inputPath;
            }

            var result = babel.transform(options.code, settings);

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