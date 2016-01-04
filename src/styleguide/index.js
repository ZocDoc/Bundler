var path = require('path');

var isExcludedStyleguideFile = function(filePath) {
    if (filePath.indexOf('styleguide-documentation') > -1
        || filePath.indexOf('styleguide-docummentation') > -1) {
        return true;
    }

    return false;
};

var isLegacyStyleguideFile = function(filePath) {
    return filePath.indexOf('legacy') > -1;
};

var isStyleguideFile = function(filePath) {
    if (filePath.indexOf('styleguide') > -1
        && !isExcludedStyleguideFile(filePath)) {
        return true;
    }

    if (path.basename(filePath).indexOf('sg.') === 0) {
        return true;
    }

    return false;
};

module.exports = {
    isStyleguideFile: isStyleguideFile,
    isLegacyStyleguideFile: isLegacyStyleguideFile
};