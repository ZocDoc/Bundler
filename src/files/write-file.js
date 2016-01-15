var fs = require('fs');
var Promise = require('bluebird');
var sourceMap = require('./source-map');

function write(code, map, fileType, outputPath, siteRoot) {

    return new Promise(function(resolve, reject) {

        map = sourceMap.clean(map, siteRoot);

        fs.writeFile(outputPath, getCodeToWrite(code, map, fileType), 'utf-8', function(err) {

            if (err) {
                reject(err);
            }

            resolve({
                code: code
            });

        });

    });

}

function getCodeToWrite(code, map, fileType) {

    if (map) {

        code = code + '\n' + sourceMap.getComment(map, fileType);

    }

    return code;

}

module.exports = write;