var fs = require('fs');
var Promise = require('bluebird');
var readTextFile = require('../read-text-file');

function readCode(filePath, mapFilePath) {

    return new Promise(function(resolve, reject) {

        readTextFile(filePath, function(code) {

            fs.stat(mapFilePath, function(err) {

                if (!err) {

                    readTextFile(mapFilePath, function(map) {
                        resolve({
                            code: code,
                            map: map
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

module.exports = readCode;