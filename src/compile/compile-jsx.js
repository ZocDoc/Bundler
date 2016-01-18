var babel = require('./babel-compiler');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {boolean} options.sourceMap
 * @returns {bluebird}
 */
function compile(options) {

    return babel.transform([
        require('babel-preset-react')
    ], options);

}

module.exports = compile;