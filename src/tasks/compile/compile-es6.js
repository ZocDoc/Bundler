var babel = require('babel-core');
var path = require('path');
var sourceMap = require('../../source-map-utility');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.filePath
 * @param {string} options.nodeModulesPath
 * @param {boolean} options.sourceMap
 * @param {string} options.siteRoot
 * @param {function} options.callback
 */
function compile(options) {

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

    options.callback(result.code);

}

module.exports = compile;