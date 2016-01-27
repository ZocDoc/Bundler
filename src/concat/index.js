var FileType = require('../file').type;

/**
 * @param {Array<Object>} files
 * @param {string} fileType
 */
function concat(files, fileType) {

    var code = [];

    files.forEach(function(file) {

        switch (fileType) {

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

    return code.join('');

}

module.exports = concat;