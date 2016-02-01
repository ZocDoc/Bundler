var Generator = require('./generator');
var getMappings = require('./get-mappings');
var convert = require('convert-source-map');

function Combiner() {

    this.generator = new Generator();

}

Combiner.prototype.addFile = function addFile(path, code, map, offset) {

    offset = offset || {};

    if (!offset.hasOwnProperty('line')) {
        offset.line = 0;
    }

    if (!offset.hasOwnProperty('column')) {
        offset.column = 0;
    }

    if (map) {
        this._addExistingMap(path, code, map, offset);
    } else {
        this._addGeneratedMap(path, code, offset);
    }

};

Combiner.prototype._addGeneratedMap = function _addGeneratedMap(path, code, offset) {

    this.generator.addGeneratedMappings(path, code, offset);

};

Combiner.prototype._addExistingMap = function _addExistingMap(path, code, map, offset) {

    var mappings = getMappings(map),
        i;

    for (i = 0; i < mappings.length; i++) {
        this.generator.addMappings(
            mappings[i].source,
            [mappings[i]],
            offset
        );
    }

};

Combiner.prototype.toSourceMap = function toSourceMap() {

    var base64 = this.generator.base64Encode();

    return convert.fromBase64(base64).toObject();

};

module.exports = Combiner;