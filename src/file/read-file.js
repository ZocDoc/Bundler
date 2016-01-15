var fs = require('fs');
var Promise = require('bluebird');
var readTextFile = require('../read-text-file');
var sourceMap = require('./source-map');

function read(filePath) {

    return new Promise(function(resolve, reject) {

        readTextFile(filePath, function(code) {

            resolve({
                code: sourceMap.stripComment(code)
            });

        });

    });

}

module.exports = read;