var path = require('path');

function getSourceMapRoot(filePath, siteRoot) {

    var directory = path.dirname(filePath);

    siteRoot = path.normalize(siteRoot);

    return directory.replace(siteRoot, '');

}

function getSourceFilePath(filePath, siteRoot) {

    var sourceMapRoot = getSourceMapRoot(filePath, siteRoot),
        sourceMapPath = path.join(sourceMapRoot, path.basename(filePath));

    return sourceMapPath.replace(/\\/g, '/')

}

module.exports = {
    getSourceMapRoot: getSourceMapRoot,
    getSourceFilePath: getSourceFilePath
};