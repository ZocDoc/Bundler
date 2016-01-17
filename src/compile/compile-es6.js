var babel = require('./babel-compiler');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {string} options.nodeModulesPath
 * @param {boolean} options.sourceMap
 * @returns {bluebird}
 */
function compile(options) {

    return babel.transform({
        presets: ['babel-preset-es2015', 'babel-preset-react']
    }, options);

}

module.exports = compile;