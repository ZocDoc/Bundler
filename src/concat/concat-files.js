var FileType = require('../file').type;

/**
 * @param {object} options
 * @param {Array<object>} options.files
 * @param {string} options.fileType
 */
function concat(options) {

    var code = [];

    options.files.forEach(function(file) {

        switch (options.fileType) {

            case FileType.CSS:
                code.push(file.code);
                code.push('\n');
                break;

            case FileType.JS:
                code.push(';');
                code.push(file.code);
                code.push('\n');
                break;

        }

    });

    return {
        code: code.join('')
    };

}

module.exports = concat;