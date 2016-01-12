var fs = require('fs');
var Promise = require('bluebird');
var sourceMap = require('../source-map');
var sourceMapUtil = require('../source-map-utility');

function writeCode(code, map, outputPath, mapOutputPath, siteRoot) {

    return new Promise(function(resolve, reject) {

        map = sourceMap.clean(map, mapOutputPath, siteRoot);

        fs.writeFile(outputPath, getCodeToWrite(code, map, mapOutputPath, siteRoot), 'utf-8', function(err) {

            if (err) {
                reject(err);
            }

            if (map) {

                fs.writeFile(mapOutputPath, JSON.stringify(map), 'utf-8', function(err) {

                    if (err) {
                        reject(err);
                    }

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

}

function getCodeToWrite(code, map, mapOutputPath, siteRoot) {

    if (map) {

        var mapUrl = sourceMapUtil.getSourceFilePath(mapOutputPath, siteRoot);

        code = code + '\n/* # sourceMappingURL=' + mapUrl + ' */';

    }

    return code;

}

module.exports = writeCode;