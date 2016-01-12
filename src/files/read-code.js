var fs = require('fs');
var exists = require('./exists');
var Promise = require('bluebird');
var readTextFile = require('../read-text-file');

function readCode(filePath, mapFilePath) {

    return new Promise(function(resolve, reject) {

        readTextFile(filePath, function(code) {

            exists(mapFilePath, function(err, mapExists) {

                if (err) {
                    reject(err);
                }

                if (mapExists) {

                    readTextFile(mapFilePath, function(map) {

                        resolve({
                            code: removeSourceMapUrl(code),
                            map: JSON.parse(map)
                        });

                    });

                } else {

                    resolve({
                        code: code
                    });

                }

            });

        });

    });

}

function removeSourceMapUrl(code) {

    return code.replace(/\n\/(\*|\/)# sourceMappingURL=(.*)$/g, '');

}

module.exports = readCode;