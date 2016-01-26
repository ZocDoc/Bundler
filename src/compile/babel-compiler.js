var babel = require('babel-core');
var Promise = require('bluebird');

/**
 * @param {object} babelOptions
 * @param {string[]} [babelOptions.presets]
 * @param {string[]} [babelOptions.plugins]
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {boolean} options.sourceMap
 * @returns {bluebird}
 */
function compile(babelOptions, options) {

    return new Promise(function(resolve, reject) {

        try {

            var settings = {
                presets: babelOptions.presets,
                plugins: babelOptions.plugins
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
    compile: compile
};