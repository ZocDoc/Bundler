var SourceMapGenerator = require('source-map').SourceMapGenerator;

function Generator() {

    this.generator = new SourceMapGenerator({
        file: '',
        sourceRoot: ''
    });

}

Generator.prototype.addMappings = function addMappings(sourceFile, mappings, offset) {

    var generator = this.generator;

    offset = offset || {};
    offset.line = offset.hasOwnProperty('line') ? offset.line : 0;
    offset.column = offset.hasOwnProperty('column') ? offset.column : 0;

    mappings.forEach(function (mapping) {
        generator.addMapping({
            source: mapping.original ? sourceFile : undefined,
            original: mapping.original,
            generated: offsetMapping(mapping.generated, offset)
        });
    });

};

Generator.prototype.addGeneratedMappings = function addGeneratedMappings(sourceFile, source, offset) {

    var mappings = [],
        linesToGenerate = newlinesIn(source) + 1,
        location,
        line;

    for (line = 1; line <= linesToGenerate; line++) {

        location = {
            line: line,
            column: 0
        };

        mappings.push({
            original: location,
            generated: location
        });

    }

    this.addMappings(sourceFile, mappings, offset);

};

Generator.prototype.base64Encode = function base64Encode() {

    var map = this.toString();

    return new Buffer(map).toString('base64');

};

Generator.prototype.toJSON = function toJSON() {

    return this.generator.toJSON();

};

Generator.prototype.toString = function toString() {

    return JSON.stringify(this);

};

function offsetMapping(mapping, offset) {

    return {
        line: offset.line + mapping.line,
        column: offset.column + mapping.column
    };

}

function newlinesIn(src) {

    if (!src){
        return 0;
    }

    var newlines = src.match(/\n/g);

    return newlines ? newlines.length : 0;

}

module.exports = Generator;