var path = require('path');

function getSourceFilePath(filePath, siteRoot) {

    var sourceMapRoot = getSourceMapRoot(filePath, siteRoot),
        sourceMapPath = path.join(sourceMapRoot, path.basename(filePath)).replace(/\\/g, '/');

    if (!sourceMapPath.startsWith('/')) {
        sourceMapPath = '/' + sourceMapPath;
    }

    return sourceMapPath;

}

function getSourceMapRoot(filePath, siteRoot) {

    var directory = path.normalize(path.dirname(filePath));

    siteRoot = path.normalize(siteRoot);

    return directory.replace(siteRoot, '');

}

module.exports = getSourceFilePath;