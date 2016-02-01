var path = require('path');

function clean(map, siteRoot) {

    if (!map) {
        return map;
    }

    return {
        version: map.version,
        sources: cleanSources(map.sources, siteRoot),
        names: map.names,
        mappings: map.mappings
    };

}

function cleanSources(sources, siteRoot) {

    return sources.map(function(source) {
        return getSourceFilePath(source, siteRoot);
    });

}

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

module.exports = clean;