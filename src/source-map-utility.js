var path = require('path');

function getSourceMapRoot(filePath, siteRoot) {

    var directory = path.dirname(filePath);

    siteRoot = path.normalize(siteRoot);

    return directory.replace(siteRoot, '');

}

module.exports = {
    getSourceMapRoot: getSourceMapRoot
};