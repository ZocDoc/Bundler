var babel = require('babel-core');
var compileAsync = require('../compile-async');
var path = require('path');
var Promise = require('bluebird');
var sourceMap = require('../source-map-utility');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {string} options.nodeModulesPath
 * @param {boolean} options.sourceMap
 * @param {string} options.siteRoot
 * @returns {bluebird}
 */
function compile(options) {

    return new Promise(function(resolve, reject) {

        try {

            var babelOptions = {
                presets: [
                    path.join(options.nodeModulesPath, 'babel-preset-es2015'),
                    path.join(options.nodeModulesPath, 'babel-preset-react')
                ]
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

module.exports = compileAsync(compile);