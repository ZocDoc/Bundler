var _ = require('underscore');
var FileType = require('../file').type;
require('../string-extensions');

/**
 * @param {object} options
 * @param {Array<object>} options.files
 * @param {string} options.fileType
 */
function validate(options) {

    var validExtension = options.fileType == FileType.JS ? '.js' : '.css';
    var minExtension = '.min' + validExtension;

    var fileHash = {};
    options.files.forEach(function (file) {
        fileHash[file] = true;
    });

    options.files.forEach(function(file) {

        if (!file.endsWith(validExtension)) {
            throw new Error('Invalid file ' + file + ' - only ' + validExtension + ' files may be added to webpack bundles');
        }

        if (file.endsWith(minExtension)) {
            var nonMinFile = file.replace(minExtension, validExtension);
            if (!fileHash[nonMinFile]) {
                throw new Error(file + ' is missing a corresponding unminified file in the bundle.');
            }
        } else {
            var minFile = file.replace(validExtension, minExtension);
            if (!fileHash[minFile]) {
                throw new Error(file + ' is missing a corresponding minified file in the bundle.');
            }
        }

    });

}

exports.validate = validate;