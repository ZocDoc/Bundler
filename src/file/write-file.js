
var fs = require('fs');
var Promise = require('bluebird');
var sourceMap = require('./source-map');
var convert = require('convert-source-map');
var path = require('path');

function write(code, map, fileType, outputPath, siteRoot) {

		map = sourceMap.clean(map, siteRoot);
		
        if (map) {
            return writeSourceMaps(map, outputPath, siteRoot).then(function(relativeSourceMapPath) {
                return writeCodeFile(outputPath, code, fileType, relativeSourceMapPath, map);
            });
        }

        return writeCodeFile(outputPath, code, fileType, undefined, map);
}

function writeCodeFile(outputPath, code, fileType, relativeSourceMapPath, map) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(outputPath, getCodeToWrite(code, relativeSourceMapPath, fileType), 'utf-8', function(err) {

            if (err) {
                reject(err);
            }

            resolve({
                code: code,
                map: map,
            });

        });
    });
}

function writeSourceMaps(map, outputPath, siteRoot) {
    return new Promise(function(resolve, reject) {
        var mapFileName = outputPath + '.map';
        fs.writeFile(mapFileName, convert.fromObject(map).toJSON(), 'utf-8', function(err) {

            if (err) {
                reject(err);
            }

            resolve(path.parse(mapFileName).base);

        });
    });
}

function getCodeToWrite(code, relativeSourceMapPath, fileType) {

    if (relativeSourceMapPath) {

        code = code + '\n' + sourceMap.getComment(relativeSourceMapPath, fileType);

    }

    return code;

}

module.exports = write;