var _ = require('underscore');
var path = require('path');

function clean(map, outputPath, siteRoot) {

    if (!map) {
        return map;
    }

    return {
        version: map.version,
        sources: cleanSources(map.sources, outputPath, siteRoot),
        names: map.names,
        mappings: map.mappings
    };

}

function cleanSources(sources, outputPath, siteRoot) {

    return sources.map(function(source) {
        return getSourceFilePath(source, outputPath, siteRoot);
    });

}

function getAbsolutePath(relativePath, outputPath) {

    if (path.isAbsolute(relativePath)) {
        return relativePath;
    }

    return path.resolve(path.dirname(outputPath), relativePath);

}

function getSourceMapRoot(filePath, outputPath, siteRoot) {

    filePath = getAbsolutePath(filePath, outputPath);

    var directory = path.normalize(path.dirname(filePath));

    siteRoot = path.normalize(siteRoot);

    return directory.replace(siteRoot, '');

}

function getSourceFilePath(filePath, outputPath, siteRoot) {

    var sourceMapRoot = getSourceMapRoot(filePath, outputPath, siteRoot),
        sourceMapPath = path.join(sourceMapRoot, path.basename(filePath));

    return sourceMapPath.replace(/\\/g, '/')

}

module.exports = clean;