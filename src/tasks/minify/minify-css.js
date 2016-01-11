var CleanCss = require('clean-css');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.filePath
 * @param {function} options.callback
 */
function minify(options) {

    var cleaner = new CleanCss({
        advanced: false,
        restructuring: false
    });

    cleaner.minify(options.code, function(err, css) {

        if (err) {
            throw err;
        }

        options.callback(css);

    });

}

module.exports = minify;