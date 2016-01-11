var babel = require('babel-core');
var path = require('path');
var sourceMap = require('../source-map-utility');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.filePath
 * @param {string} options.nodeModulesPath
 * @param {boolean} options.sourceMap
 * @param {string} options.siteRoot
 * @param {function} options.success
 * @param {function} options.error
 */
function compile(options) {

    try {

        var babelOptions = {
            presets: [
                path.join(options.nodeModulesPath, 'babel-preset-es2015'),
                path.join(options.nodeModulesPath, 'babel-preset-react')
            ]
        };

        if (options.sourceMap) {
            babelOptions.sourceMaps = 'inline';
            babelOptions.sourceFileName = sourceMap.getSourceFilePath(options.filePath, options.siteRoot);
        }

        var result = babel.transform(options.code, babelOptions);

        options.success(result.code);

    } catch (err) {

        options.error(err);

    }

}

module.exports = compile;