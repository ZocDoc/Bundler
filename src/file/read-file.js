var Promise = require('bluebird');
var readTextFile = require('../read-text-file');
var sourceMap = require('./source-map');

function read(filePath) {

    return new Promise(function(resolve) {

        readTextFile(filePath, function(code) {

            var extractedCode = sourceMap.extract(code);

            resolve({
                path: filePath,
                code: extractedCode.code,
                map: extractedCode.map
            });

        });

    });

}

module.exports = read;