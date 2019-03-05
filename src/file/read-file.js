var Promise = require('bluebird');
var readTextFile = require('../read-text-file');
var sourceMap = require('./source-map');
var path = require('path');

function read(filePath) {
    return new Promise(function(resolve) {

        var fileDir = path.parse(filePath).dir;
        readTextFile(filePath, function(code) {

            var extractedCode = sourceMap.extract(code, fileDir);

            resolve({
                code: extractedCode.code,
                map: extractedCode.map
            });

        });

    });

}

module.exports = read;