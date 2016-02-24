var path = require('path');

var browserPackPreludeFile = 'node_modules/browser-pack/_prelude.js';

function clean(map, siteRoot) {

    var sources,
        sourcesContent;

    if (!map) {
        return map;
    }

    sources = cleanSources(map.sources, siteRoot);
    sourcesContent = getSourcesContent(sources, map.sourcesContent);

    return {
        version: map.version,
        sources: sources,
        names: map.names,
        mappings: map.mappings,
        sourcesContent: sourcesContent
    };

}

function cleanSources(sources, siteRoot) {

    return sources.map(function(source) {

        if (source === browserPackPreludeFile) {
            return source;
        }

        return getSourceFilePath(source, siteRoot);

    });

}

function getSourceMapRoot(filePath, siteRoot) {

    var directory = path.normalize(path.dirname(filePath));

    siteRoot = path.normalize(siteRoot);

    return directory.replace(siteRoot, '');

}

function getSourceFilePath(filePath, siteRoot) {

    var sourceMapRoot = getSourceMapRoot(filePath, siteRoot),
        sourceMapPath = path.join(sourceMapRoot, path.basename(filePath)).replace(/\\/g, '/');

    if (!sourceMapPath.startsWith('/')) {
        sourceMapPath = '/' + sourceMapPath;
    }

    return sourceMapPath;

}

function getSourcesContent(sources, sourcesContent) {

    if (sources.length < 1 || !sourcesContent || sourcesContent.length < 1) {
        return undefined;
    }

    if (sources[0] === browserPackPreludeFile) {
        return [sourcesContent[0]];
    }

}

module.exports = clean;