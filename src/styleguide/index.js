var path = require('path');

var isStyleguideFile = function(filePath) {
    if (filePath.indexOf('styleguide') > -1) {
        return true;
    }

    if (path.basename(filePath).indexOf('sg.') === 0) {
        return true;
    }

    return false;
};

module.exports = {
    isStyleguideFile: isStyleguideFile
};