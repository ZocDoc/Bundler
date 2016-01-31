var getSourceFilePath = require('./get-source-file-path');

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

module.exports = clean;