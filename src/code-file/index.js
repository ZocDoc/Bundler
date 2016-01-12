var Concat = require('concat-with-sourcemaps');
var sourceMap = require('../source-map');

function CodeFile() {

    this.files = [];

}

CodeFile.prototype.addFile = function(code, map) {

    this.files.push({
        code: code,
        map: map
    });

};

CodeFile.prototype.concatenate = function(options) {

    var concat = new Concat(options.sourceMap, '', '\n');

    this.files.forEach(function(file) {
        concat.add(null, ';' + file.code, JSON.stringify(file.map));
    });

    return {
        code: concat.content.toString(),
        map: concat.sourceMap ? JSON.parse(concat.sourceMap) : undefined
    };

};

module.exports = CodeFile;