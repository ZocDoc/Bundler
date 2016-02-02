var SourceMapConsumer = require('source-map').SourceMapConsumer;

/**
 * @param {object} map
 * @returns {Array<object>}
 */
function getMappings(map) {

    var consumer = new SourceMapConsumer(map),
        mappings = [];

    consumer.eachMapping(function (mapping) {

        mappings.push({
            original: mapping.originalColumn != null
                ? {
                    column: mapping.originalColumn,
                    line: mapping.originalLine
                }
                : undefined,
            generated: {
                column: mapping.generatedColumn,
                line: mapping.generatedLine
            },
            source: mapping.originalColumn != null
                ? mapping.source
                : undefined,
            name: mapping.name
        });

    });

    return mappings;

}

module.exports = getMappings;