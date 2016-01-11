var react = require('react-tools');
var sourceMap = require('../source-map-utility');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.filePath
 * @param {boolean} options.sourceMap
 * @param {string} options.siteRoot
 * @param {function} options.success
 * @param {function} options.error
 */
function compile(options) {

    try {

        var reactOptions = {};

        if (options.sourceMap) {
            reactOptions.sourceMap = true;
            reactOptions.sourceFilename = sourceMap.getSourceFilePath(options.filePath, options.siteRoot);
        }

        var compiledJsx = react.transform(options.code, reactOptions);

        options.success(compiledJsx);

    } catch (err) {

        options.error(err);

    }

}

module.exports = compile;