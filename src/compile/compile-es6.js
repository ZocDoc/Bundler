var babel = require('babel-core');

var LOOSE = { loose: true };

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
                [require('babel-plugin-transform-es2015-classes'), LOOSE],
                [require('babel-plugin-transform-es2015-computed-properties'), LOOSE],
                [require('babel-plugin-transform-es2015-destructuring'), LOOSE],
                [require('babel-plugin-transform-es2015-for-of'), LOOSE],
                [require('babel-plugin-transform-es2015-modules-commonjs'), LOOSE],
                [require('babel-plugin-transform-es2015-spread'), LOOSE],
                [require('babel-plugin-transform-es2015-template-literals'), LOOSE],
                require('babel-plugin-check-es2015-constants'),
                require('babel-plugin-syntax-async-functions'),
                require('babel-plugin-transform-es2015-arrow-functions'),
                require('babel-plugin-transform-es2015-block-scoped-functions'),
                require('babel-plugin-transform-es2015-block-scoping'),
                require('babel-plugin-transform-es2015-function-name'),
                require('babel-plugin-transform-es2015-literals'),
                require('babel-plugin-transform-es2015-object-super'),
                require('babel-plugin-transform-es2015-parameters'),
                require('babel-plugin-transform-es2015-shorthand-properties'),
                require('babel-plugin-transform-es2015-sticky-regex'),
                require('babel-plugin-transform-es2015-typeof-symbol'),
                require('babel-plugin-transform-es2015-unicode-regex'),
                require('babel-plugin-transform-proto-to-assign'),
                require('babel-plugin-transform-regenerator')
            ],
            presets: [
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