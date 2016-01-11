var babel = require('./babel');
var Promise = require('bluebird');

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

            var result = babel.transform(['babel-preset-es2015', 'babel-preset-react'], options);

            resolve({
                code: result.code,
                map: result.map
            });

        } catch (err) {

            reject(err);

        }

    });

}

module.exports = compile;