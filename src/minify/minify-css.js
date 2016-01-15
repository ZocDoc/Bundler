var CleanCss = require('clean-css');
var Promise = require('bluebird');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @returns {bluebird}
 */
function minify(options) {

    return new Promise(function(resolve, reject) {

        try {

            var cleaner = new CleanCss({
                advanced: false,
                restructuring: false
            });

            cleaner.minify(options.code, function (err, result) {

                if (err) {
                    reject(err);
                } else {
                    resolve({
                        code: result.styles
                    });
                }

            });

        } catch (err) {

            reject(err);

        }

    });

}

module.exports = minify;