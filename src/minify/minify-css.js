var CleanCss = require('clean-css');
var path = require('path');
var Promise = require('bluebird');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {object} options.map
 * @param {string} options.inputPath
 * @param {boolean} options.sourceMap
 * @returns {bluebird}
 */
function minify(options) {

    return new Promise(function(resolve, reject) {

        try {

            var cleaner = new CleanCss({
                advanced: false,
                restructuring: false,
                sourceMap: options.sourceMap
            });

            var css = {};
            css[getFilePath(options.inputPath, options.map)] = {
                styles: options.code,
                sourceMap: JSON.stringify(options.map)
            };

            cleaner.minify(css, function (err, result) {

                if (err) {
                    reject(err);
                } else {
                    resolve({
                        code: result.styles,
                        map: parseSourceMap(result.sourceMap, options.inputPath)
                    });
                }

            });

        } catch (err) {

            reject(err);

        }

    });

}

function getFilePath(inputPath, map) {

    if (map) {
        return path.basename(inputPath);
    } else {
        return inputPath;
    }

}

function parseSourceMap(sourceMap, inputPath) {

    if (!sourceMap) {
        return undefined;
    }

    var parsedSourceMap = JSON.parse(sourceMap);

    parsedSourceMap.sources = parsedSourceMap.sources.map(function(source) {

        if (path.dirname(source) === '.') {
            return path.join(path.dirname(inputPath), source);
        } else {
            return source;
        }

    });

    return parsedSourceMap;

}

module.exports = minify;