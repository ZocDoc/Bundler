var babel = require('./babel-compiler');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {boolean} options.sourceMap
 * @returns {bluebird}
 */
function compile(options) {

    return babel.compile({
        plugins: [
            require("babel-plugin-transform-es2015-template-literals"),
            require("babel-plugin-transform-es2015-literals"),
            require("babel-plugin-transform-es2015-function-name"),
            require("babel-plugin-transform-es2015-arrow-functions"),
            require("babel-plugin-transform-es2015-block-scoped-functions"),
            require("babel-plugin-transform-es2015-shorthand-properties"),
            require("babel-plugin-transform-es2015-sticky-regex"),
            require("babel-plugin-transform-es2015-unicode-regex"),
            require("babel-plugin-check-es2015-constants"),
            require("babel-plugin-transform-es2015-spread"),
            require("babel-plugin-transform-es2015-parameters"),
            require("babel-plugin-transform-es2015-destructuring"),
            require("babel-plugin-transform-es2015-block-scoping"),
            require("babel-plugin-syntax-async-functions"),
            require("babel-plugin-transform-regenerator"),
            require("babel-plugin-transform-strict-mode")
        ],
        presets: [
            require('babel-preset-react')
        ]
    }, options);

}

module.exports = compile;