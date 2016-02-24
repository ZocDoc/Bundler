var babel = require('babel-core');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {boolean} options.sourceMap
 * @returns {Promise}
 */
function compile(options) {

    return new Promise(function(resolve) {

        var settings = {
            plugins: [
                require('babel-plugin-syntax-async-functions'),
                require('babel-plugin-transform-proto-to-assign'),
                require('babel-plugin-transform-regenerator')
            ],
            presets: [
                require('babel-preset-es2015-loose'),
                require('babel-preset-react')
            ]
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

    });

}

module.exports = compile;