var Promise = require('bluebird');

/**
 * @param {object} options
 * @param {string} options.code
 * @returns {bluebird}
 */
function compile(options) {

    return new Promise(function(resolve, reject) {

        resolve({
            code: options.code
        });

    });

}

module.exports = compile;