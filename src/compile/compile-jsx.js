var babel = require('./babel-compiler');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {boolean} options.sourceMap
 * @returns {Promise}
 */
function compile(options) {

    return babel.compile({
        presets: [
            require('babel-preset-react')
        ]
    }, options);

}

module.exports = compile;