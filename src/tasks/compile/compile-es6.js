var babel = require('babel-core');
var path = require('path');
var sourceMap = require('../../source-map-utility');

function compile(code, filePath, nodeModulesPath, options) {

    var babelOptions = {
        presets: [
            path.join(nodeModulesPath, 'babel-preset-es2015'),
            path.join(nodeModulesPath, 'babel-preset-react')
        ]
    };

    if (options.sourceMap) {
        babelOptions.sourceMaps = 'inline';
        babelOptions.sourceFileName = sourceMap.getSourceFilePath(filePath, options.siteRoot);
    }

    var result = babel.transform(code, babelOptions);

    return result.code;

}

module.exports = compile;